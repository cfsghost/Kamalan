
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

function TestClass() {
	var privateMember = 'Good';
	this.testMethod1 = function() {
	};
	this.testMethod2 = function() {
	};
	this.testMember = 'Cool';
}

var TestFunc1 = function(param) {
};

function TestFunc2(param) {
};

var obj = {
	A: 123,
	B: 'Nice',
	C: function() {
	}
};
var arr = [];
var num = 123;

var TestClassInstance = new TestClass;
