
var Blog = new function() {
	var articles = [];

	this.addArticle = function(subject, text, callback) {
		articles.push({
			subject: subject,
			text: text,
			timestamp: new Date().getTime()
		});

		callback(null);
	};

	this.listArticles = function(callback) {

		callback(null, articles);
	};

	this.articleCount = function(callback) {

		callback(null, articles.length);
	};
};
