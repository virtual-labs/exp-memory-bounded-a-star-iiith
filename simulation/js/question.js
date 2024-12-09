var correct_ans = 1;
var isQuestion = false;

var NoQuestion = true;
var chance = 0.5;

var wrongSubmissions = 0;

var selected; 
var QnA = [
	['What is the next node to visit?', 'visit.top().element'],
    ['What is the f value of the next node?', 'visit.top().priority'],
    ['From which node will the next node be visited?', 'parent[visit.top().element]']
]

var hints = [
	'',
	'',
	'Find the path in the graph whose path cost gives the frontier value of the path cost.'
]

function question() {
	selected = Math.floor(Math.random() * QnA.length);
	document.getElementById('question').innerHTML = QnA[selected][0];
}

function submit(a) {
	correct_ans = eval(QnA[selected][1]);
	console.log(typeof(Number(a)), typeof(correct_ans));
	console.log(Number(a), correct_ans);
	if (Number(a) == correct_ans) {
		document.getElementById('ans').style.color = 'black';
		document.getElementById('hint').innerHTML = '';
		isQuestion = false;
		wrongSubmissions = 0;
	} else {
		document.getElementById('ans').style.color = 'red';
		a = "";
		wrongSubmissions++;

		if (wrongSubmissions == 7) {
			document.getElementById('ans').style.color = 'black';
			document.getElementById('hint').innerHTML = '';
			isQuestion = false;
			wrongSubmissions = 0;
		}
		else if (wrongSubmissions > 4) {
			document.getElementById('hint').innerHTML = 'The correct answer is: ' + correct_ans;
		}
		else if (wrongSubmissions > 2) {
			document.getElementById('hint').innerHTML = hints[selected];
		}
	}
}

