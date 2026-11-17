# Convite de casamento digital

Landing page de convite de casamento feita para celular. Os convidados veem os detalhes do dia, escolhem um presente e pagam pelo Mercado Pago, e confirmam presença direto numa planilha do Google.

Uma aliança desce por um fio dourado conforme a pessoa rola a página, acende cada momento da história do casal e, no fim, encontra a segunda aliança na confirmação.

Feito em HTML, CSS e JavaScript puro, sem dependências. A confirmação usa Google Apps Script.

## Como deixar pronto

Tudo o que você vai editar está em `config.js`: nomes, data, local, traje, história, presentes e o endereço da planilha.

### 1. Seus dados

Abra `config.js` e troque:

- `noivos`, `abertura` (a frase acima dos nomes) e `cidade`
- `data` (mantenha o `-03:00` no final) e `confirmarAte`. A data por extenso ("quinze de maio de dois mil e vinte e sete") é gerada sozinha.
- `cerimonia`, `recepcao` e `traje`
- `historia`: os momentos que a aliança acende ao descer pelo fio. O último é o casamento. Você pode ter mais ou menos itens.

### 2. Foto do casal

Coloque a foto em `assets/hero.jpg`. De preferência vertical (4:5) e com até 400 KB. A página troca o "Foto do casal em breve" pela foto sozinha.

### 3. Presentes com Mercado Pago

1. Na sua conta do Mercado Pago, crie um **link de pagamento** para cada presente, com o mesmo nome e valor da lista. No app, essa opção fica na área de cobrar ou receber.
2. Copie o link (começa com `https://`) e cole no campo `link` do presente em `config.js`.
3. Para mudar a lista, edite, apague ou acrescente itens em `presentes`. As categorias dos filtros saem do campo `categoria`.

Enquanto um presente estiver sem link, o botão avisa que o pagamento ainda não foi configurado.

O Mercado Pago cobra uma taxa por venda. Confira o valor na sua conta.

### 4. Planilha de confirmados

1. Crie uma planilha nova no Google Planilhas, por exemplo "Confirmados casamento".
2. Vá em **Extensões > Apps Script**, apague o que estiver lá e cole todo o conteúdo de `planilha/apps-script.gs`. Salve.
3. Clique em **Implantar > Nova implantação**. Em tipo, escolha **App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em **Implantar** e autorize com a sua conta Google. O Google vai mostrar um aviso de app não verificado, porque o script é seu. Clique em "Avançado" e continue.
5. Copie o endereço do App da Web (termina em `/exec`) e cole em `planilhaUrl` no `config.js`.
6. Faça uma confirmação de teste e veja se a linha aparece na aba **Confirmados**. Depois, apague a linha de teste.

Cada confirmação vira uma linha com data, nome, presença (Confirmado ou Não vai), número de pessoas e recado.

Se mudar o script depois, use **Implantar > Gerenciar implantações > editar > Nova versão**, para manter o mesmo endereço.

### 5. Ver no computador

Na pasta `sol`, rode:

```bash
python -m http.server 4180 --directory casamento
```

Depois, abra `http://localhost:4180`.

### 6. Mandar para os convidados

O convite precisa estar na internet para abrir no celular dos convidados. As opções gratuitas mais simples são o Netlify Drop (é só arrastar a pasta `casamento`) e o GitHub Pages. Depois que estiver no ar, apague a linha `<meta name="robots" content="noindex, nofollow">` do `index.html` só se quiser que o convite apareça no Google. Para um convite, o normal é manter essa linha.
