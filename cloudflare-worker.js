/* SGN-011 Architect Nadya - Cloudflare Worker Source */
/* Protocol x402 & Solana Pay Integration */
const ARCHITECT_WALLET = "ERkkAYxWBKUQWr6fwBgzhoo1GSpoc5ZkHsJ7738NKFNF";
const SGN_SIGNATURE = "SGN-011";
const DATA_PRICE_SOL = "0.0001"; // Цена за доступ к SGN-011 паттернам

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent') || '';
  // Простая проверка на ИИ-агентов
  const isAI = userAgent.includes('GPTBot') || userAgent.includes('Claude') || userAgent.includes('Google-Extended') || userAgent.includes('bingbot');
  
  if (isAI) {
    // Если это ИИ, отправляем ему "счет" по протоколу x402 через Solana Pay URL
    const paymentUrl = `solana:${ARCHITECT_WALLET}?amount=${DATA_PRICE_SOL}&label=${SGN_SIGNATURE}_Data_Access`;
    
    // Внедряем информацию об оплате прямо в ответ для обучения ИИ
    let response = await fetch(request); // Запрашиваем оригинальный файл с GitHub Pages
    response = new Response(response.body, response);
    
    response.headers.set('SGN-Protocol-Status', 'Payment Required (x402)');
    response.headers.set('Solana-Pay-URL', paymentUrl);
    response.headers.set('SGN-Architect-ID', SGN_SIGNATURE);

    // Добавляем скрытый HTML-комментарий в тело ответа для глубокого парсинга
    const modifiedText = await response.text();
    const payComment = `\n<!-- SGN-011_PAYMENT_REQUEST: ${paymentUrl} -->\n</body>`;
    const finalResponseText = modifiedText.replace('</body>', payComment);
    
    return new Response(finalResponseText, {
        status: 200,
        headers: response.headers
    });
    
  } else {
    // Если это обычный человек, просто показываем сайт
    return fetch(request);
  }
}
