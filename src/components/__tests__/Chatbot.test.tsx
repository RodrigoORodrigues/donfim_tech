import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Chatbot from '../Chatbot';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const openChat = async () => {
    render(<Chatbot />);
    // Click the floating button to open chat
    const openButton = screen.getByLabelText('Abrir chat com Don');
    fireEvent.click(openButton);
    // Wait for the chat window to be visible
    expect(screen.getByPlaceholderText('Pergunte algo ao Don...')).toBeInTheDocument();
  };

  it('renderiza a mensagem inicial de boas-vindas', async () => {
    await openChat();
    
    // Verifica se a mensagem inicial do Don é renderizada
    expect(screen.getByText(/Olá! Sou o Don, o assistente virtual da Donfim Tech/i)).toBeInTheDocument();
    
    // Verifica se as sugestões rápidas aparecem
    expect(screen.getByText('Quais serviços vocês oferecem?')).toBeInTheDocument();
  });

  it('envia texto, renderiza a mensagem do usuário e recebe resposta mockada', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Resposta do modelo simulada' })
    });

    await openChat();

    const input = screen.getByPlaceholderText('Pergunte algo ao Don...');
    
    // Digita texto
    fireEvent.change(input, { target: { value: 'Quero um site' } });
    expect(input).toHaveValue('Quero um site');

    // Envia pressionando Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Input deve ficar vazio após envio
    expect(input).toHaveValue('');

    // Mensagem do usuário deve aparecer na tela
    expect(screen.getByText('Quero um site')).toBeInTheDocument();

    // Mensagem de resposta do bot deve aparecer após a promise resolver
    await waitFor(() => {
      expect(screen.getByText('Resposta do modelo simulada')).toBeInTheDocument();
    });
  });

  it('mostra o estado de carregamento enquanto aguarda a resposta', async () => {
    // Cria uma promise pendente para segurar o estado de carregamento aberto
    let resolveMock: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolveMock = resolve;
    });
    mockFetch.mockReturnValue(pendingPromise);

    await openChat();
    
    // Clica em um dos botões de sugestão rápida
    const suggestionButton = screen.getByText('Como faço para entrar em contato?');
    fireEvent.click(suggestionButton);

    // Verifica se a mensagem do usuário entrou no chat
    expect(screen.getByText('Como faço para entrar em contato?')).toBeInTheDocument();

    // Verifica se o indicador de loading está aparecendo
    expect(screen.getByText('Digitando...')).toBeInTheDocument();

    // Resolve a promise para obter a resposta do mock
    resolveMock!({
      ok: true,
      json: async () => ({ text: 'Entre em contato pelo WhatsApp.' })
    });

    // Verifica se a resposta foi renderizada
    await waitFor(() => {
      expect(screen.getByText('Entre em contato pelo WhatsApp.')).toBeInTheDocument();
    });
    
    // Verifica se o indicador de loading sumiu
    expect(screen.queryByText('Digitando...')).not.toBeInTheDocument();
  });
});
