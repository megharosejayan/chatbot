const mongoose = require('mongoose')
const Question = require('./models/question.model');
const UserQuestion = require('./models/userQuestion.model');
const Institution = require('./models/institution.model');
const Keyword = require('./models/keyword.model');

mongoose.connect("mongodb://localhost/chatbot");

let institution = {
	name: "Edubridge International School",
	institutionType: "School"
}


let questions = [{
	query: "How will technology be utilized, and how will you create a safe and productive online environment where children are not distracted by gadgets and surfing the web unsupervised?",
	answer: "Information and communications technology (ICT) is here to stay, and there is no doubt that the ability to utilize ICT effectively is an immense advantage to students, job-seekers, and businesses today. This phenomenon will probably become more more profound in future years. Therefore, we will teach children how to safely and effectively use ICT. The most important point is that we must proactively teach children to use the internet properly rather than reactively punishing them when they use the internet inappropriately. There will be regularly scheduled lessons, at least once a week from Grade 3, about internet safety and security, appropriate use, and netiquette. The curriculum for these classes is available online from common sense media. Children will be closely supervised and every teacher is trained in how to use ICT appropriately. Internet safety and security is not the responsibility of the computer teachers; it is the responsibility of each and every teacher. Students will not be left unsupervised to surf the web but they will be closely supervised by teachers who have been trained in issues of cyber-safety. The teachers will also positively model appropriate use and be able to answer students' questions about computers.Students are not allowed to use their phones during lessons. This rule, and others like it, are discussed by the teacher and the class at the beginning of each semester. Teachers and students agree about the rules that govern technology usage. These are called essential agreements. Every teacher has the right to tell the students when it is appropriate or not appropriate to use ICT. There may be some lessons, or some units, where ICT is not used at all. For example, an Art teacher might teach an entire unit on sculpture without ever using the internet.",
	labels: ['IT', 'e-classrooms', 'e-learning', 'technologry', 'computer', 'computers'],
	category: "Academics",
	institutionType: "School",
	dateCreated: Date.now()
},
{
	query: "How does Edubridge International School incorporate second languages?",
	answer: `Edubridge International School (EIS) supports "language choice and multilingualism." EIS will introduce Modern World Languages from Grade 2. The choices offered include Hindi, French and Spanish. The reason for introducing a second language only in Grade 2 is to ensure that students first develop a basic level of fluency and competence in English, the primary language of instruction at EIS, and then formally study an additional language. We recognize that many young children are bilingual or trilingual already, but second languages will not be formally offered in classes below Grade 2. For questions about Modern Languages at Edubridge, please refer to the EIS Language Policy which is available for download from our website.The EIS Language Policy "highly encourage[s] language continuity and in-depth language knowledge" to ensure that students develop a positive attitude and work persistently towards fluency in a particular language and broader knowledge about that culture. We realize that most students and families that come to Edubridge are already multilingual and we want to enourage all students to develop their multilingualism. We also realize that families often have particular needs for pursuing certain languages, and we want to assist families in pursuing their own languages rather than telling them which languages to study.`,
	labels: ['language', 'languages', 'Hindi', 'English', 'Malayalam', 'French', 'German', 'second-language'],
	category: "Academics",
	institutionType: "School",
	dateCreated: Date.now()
},
{
	query: "How does assessment and grading work in the Middle Years?",
	answer: `Assessment is a natural part of learning, and the purpose of assessment is to help children improve as they are learning. In the middle years, feedback and assessment form a continuous process whereby teachers help students improve. We use rubrics to inform the students and parents of the exact descriptors for each level of achievement. We use both formative and summative assessment. Formative assessment is used during a unit and it helps the student to form a better understanding of what he is studying. Summative assessment comes at the end of a unit and it measures the student's understanding of the entire unit. Formative assessment might be a presentation, a blog entry, or a quiz. Summative assessment might be a test, an essay, or a performance.Grades are issued, on a 1 – 7 scale, at the end of each semester. These grades are issued in each subject (we might not issue grades in Physical Education or Wellness – to be decided by the teaching staff). The teacher uses all the assessments and feedback from the semester to determine a best overall fit for the semester grade. This grade is recorded on the student's transcript and reported to parents, Eventually, it might be reported to universities as well, depending on the university and the information it requires.`,
	labels: ['assignment', 'assignments', 'grading', 'marking'],
	category: "Academics",
	institutionType: "School",
	dateCreated: Date.now()
},
{
	query: "Is there a deadline in applying for admissions?",
	answer: `Edubridge International School does not have any application deadlines for student admissions. We have a rolling admissions policy, and we will accept applications around the year as long as places are available. Admissions will also be made around the year, subject to vacancies and availability of space in the concerned classes.However, we are a small school with a class limit of 24 students per year group through Grade 5 and 30 students per year group in the Secondary School. We have only one section per year group, and when a year group is full, there are no further admissions. Therefore, it is advisable to take admissions early.`,
	labels: ['admission', 'last-date', 'last', 'date', 'application', 'apply', 'applications'],
	category: "Academics",
	institutionType: "School",
	dateCreated: Date.now()
},
{
	query: "Is there an admissions test or a screening process?",
	answer: `We meet with every family who applies to ensure that Edubridge is a good fit for the child, the family​, and the school.`,
	labels: ['admissions', 'admissions', 'screening', 'test', 'selection'],
	category: "Academics",
	institutionType: "School",
	dateCreated: Date.now()
},
{
	query: "What is the fee structure?",
	answer: `The fee structure is available to any parents who visit the school. We are proud of our school and we want parents to visit and get a feel for the place before they make decisions based on finances. The fee structure is consistent with many other international schools in India.`,
	labels: ['fees', 'fee', 'fee-structure', 'money', 'payment'],
	category: "Academics",
	institutionType: "School",
	dateCreated: Date.now()
},
{
	query: "Who are the teachers?",
	answer: `Edubridge International School has hired a mix of teachers from India and abroad, consistent with our mission. We are committed to hiring the best available international schoolteachers and we have an extensive and rigorous interview process. We realize that a school is only as good as its teachers, and recruiting and retaining great teachers is our top priority. More information about our teachers and staff is available here.`,
	labels: ['teacher', 'teachers'],
	category: "Academics",
	institutionType: "School",
	dateCreated: Date.now()
},
];

function callback(err){
	console.log(err);
}

createInstitution(institution, callback);


function createInstitution(institution, callback) {
	let newInstitution = new Institution(institution);
	newInstitution.save(function (err, result) {
		if (err) {
			console.log("Error creating institution.");
			return callback(err);
		}
		let i_id = result.id;
		console.log("Institution created. ID: " + i_id);
		// callback(null, i_id, result.institutionType);
		addQuestionsToInstitution(i_id)
	});
}



function addQuestionsToInstitution(i_id) {

	questions.forEach(q => {
		addModelQuestion(q);
		q.institution = i_id;
		UserQuestion.create(q, function (err, question) {
			if(err) {
				console.log("Error saving question '" + q.query + "'");
				callback(err);
			}
			let qid = question.id;
			keywords = question.labels;
			saveKeywords(keywords, qid, i_id);
			console.log("Added question.");
		})
	});

}


function saveKeywords(keywords, q_id, i_id) {

	options = { upsert: true, new: true, setDefaultsOnInsert: true };

	keywords.forEach(keyword => {
		keyword = keyword.toLowerCase();
		Keyword.updateOne(
			{ keyword: keyword, institution: i_id },
			{ $push: { questions: q_id } },
			options,
			function (err, result) {
				if (err) {
					console.log("Error saving keywords.");
					console.log(err);
				}
				let k_id = result.id;
				addKeywordToInstitution(k_id, i_id)
			}
		)
	});
}


function addKeywordToInstitution(k_id, i_id) {
	options = { upsert: true, new: true, setDefaultsOnInsert: true };
	Institution.findByIdAndUpdate(
		i_id,
		{ $push: { keywords: k_id } },
		options,
		function (err, result) {
			if (err) {
				console.log("Error adding keywords to Institution.");
				console.log(err);
			}
		}
	)
}


function addModelQuestion(question) {
	let newQuestion = new Question(question);
	newQuestion.save(function (err, result) {
		if (err) {
			console.log("Error writing model question to db.")
			console.log(err);
		}
	})
}


console.log('Done');
// mongoose.disconnect();