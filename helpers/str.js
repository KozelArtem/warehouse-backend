const sanitizeMarkdown = str => str.replace(/(\*|_)/g, '\\$1');

module.exports = {
    sanitizeMarkdown,
};
