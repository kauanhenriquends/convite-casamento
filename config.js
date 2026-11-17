// ============================================================
//  TUDO QUE VOCÊ PRECISA EDITAR FICA NESTE ARQUIVO.
//  Nomes, data, local, história, presentes e a planilha.
// ============================================================
window.CASAMENTO = {
  noivos: ['Ana', 'Lucas'],

  // Frase de abertura do convite.
  abertura: 'Juntamente com suas famílias',
  cidade: 'Petrópolis · RJ',

  // Data e hora da cerimônia, no horário de Brasília (-03:00).
  data: '2027-05-15T16:00:00-03:00',

  // Até quando os convidados podem confirmar presença.
  confirmarAte: '2027-04-15',

  cerimonia: {
    hora: '16h',
    local: 'Espaço Jardim das Flores',
    endereco: 'Estrada das Flores, 100 – Petrópolis, RJ'
  },
  recepcao: {
    hora: '17h30',
    local: 'No mesmo espaço, logo após a cerimônia'
  },
  traje: 'Esporte fino. Deixem o branco para a noiva!',

  // Degraus da escada: o último é sempre o casamento.
  historia: [
    { ano: '2019', titulo: 'A gente se conheceu', texto: 'No aniversário de um amigo em comum. Ninguém foi embora cedo.' },
    { ano: '2021', titulo: 'Primeira viagem', texto: 'Um fim de semana na serra que virou tradição todo ano.' },
    { ano: '2023', titulo: 'Nossa casa', texto: 'As chaves, as caixas e o primeiro jantar sentados no chão.' },
    { ano: '2025', titulo: 'O pedido', texto: 'Na mesma serra da primeira viagem. A resposta foi sim.' },
    { ano: '2027', titulo: 'O grande dia', texto: 'Agora falta só você lá com a gente.' }
  ],

  // Link de pagamento do Mercado Pago de cada presente.
  // Enquanto o link estiver vazio, o botão avisa que ele ainda não foi configurado.
  presentes: [
    { categoria: 'Lua de mel', titulo: 'Passagens da lua de mel', texto: 'Uma parte das passagens para o nosso destino.', valor: 1200, link: '' },
    { categoria: 'Lua de mel', titulo: 'Uma noite no hotel', texto: 'Uma diária com vista para o mar.', valor: 450, link: '' },
    { categoria: 'Lua de mel', titulo: 'Jantar à luz de velas', texto: 'O jantar mais bonito da viagem.', valor: 280, link: '' },
    { categoria: 'Lua de mel', titulo: 'Passeio de barco', texto: 'Ver o pôr do sol do meio do mar.', valor: 220, link: '' },
    { categoria: 'Lua de mel', titulo: 'Mergulho com tartarugas', texto: 'Máscara, snorkel e muita foto.', valor: 180, link: '' },
    { categoria: 'Lua de mel', titulo: 'Drinks na praia', texto: 'Uma rodada pelo casal, com seu nome no brinde.', valor: 90, link: '' },
    { categoria: 'Casa', titulo: 'Cafeteira nova', texto: 'Para o café de todo dia, que não é negociável.', valor: 350, link: '' },
    { categoria: 'Casa', titulo: 'Jogo de panelas', texto: 'Para os jantares que vamos te convidar.', valor: 400, link: '' },
    { categoria: 'Casa', titulo: 'Primeiro mercado de casados', texto: 'Uma ajuda para encher a despensa.', valor: 150, link: '' },
    { categoria: 'Divertidos', titulo: 'Lenços para o noivo', texto: 'Ele jura que não vai chorar. Ninguém acredita.', valor: 50, link: '' },
    { categoria: 'Divertidos', titulo: 'Taxa para a noiva não atrasar', texto: 'Garantia de que ela chega no horário (ou quase).', valor: 100, link: '' },
    { categoria: 'Divertidos', titulo: 'Kit sobrevivência do DJ', texto: 'Para tocar a sua música favorita.', valor: 70, link: '' }
  ],

  // Endereço do "Aplicativo da Web" do Google Apps Script (ver LEIA-ME.md).
  // Enquanto estiver vazio, o formulário avisa que a planilha não foi conectada.
  planilhaUrl: '',

  // Máximo de pessoas por confirmação (contando quem preenche).
  maxPessoas: 6
};
