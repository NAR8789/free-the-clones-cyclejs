export const tagged = (tag, intent$) => intent$.map(intent => ({ tag, intent }))
