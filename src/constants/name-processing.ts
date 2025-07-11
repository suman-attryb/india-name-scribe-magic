// Common honorifics including Indian variations
export const HONORIFICS = [
  'mr', 'mrs', 'mrrs', 'ms', 'miss', 'dr', 'prof', 'professor',
  'sri', 'shri', 'smt', 'kumari', 'pandit', 'ustad'
];

// Common Indian name patterns for basic spell checking
export const INDIAN_NAME_PATTERNS = {
  firstNames: [
  "Rajiv", "Priyanka", "Anjali", "Arvind", "Vikram", "Neha", "Shweta", "Sanjay", "Amit", "Pooja",
  "Divya", "Rohit", "Kavita", "Manoj", "Ritu", "Deepak", "Sneha", "Alok", "Tanvi", "Vivek",
  "Ananya", "Akshay", "Swati", "Pratik", "Nidhi", "Gaurav", "Ankita", "Siddharth", "Poonam",
  "Harsh", "Riya", "Kunal", "Ishita", "Abhishek", "Shruti", "Varun", "Pallavi", "Aditya",
  "Tania", "Rohan", "Kritika", "Nikhil", "Megha", "Sameer", "Anushka", "Karan", "Radhika",
  "Arjun", "Priya", "Deepika", "Rajeev", "Vikas", "Shalini", "Ankit", "Rahul", "Sonali",
  "Harish", "Mohit", "Janhvi", "Surya", "Kriti", "Yash", "Tanushree", "Rishabh", "Aastha",
  "Dhruv", "Ishani", "Adarsh", "Bhavya", "Chirag", "Ishaan", "Falguni", "Harshita", "Inder",
  "Jeevika", "Karanveer", "Lavanya", "Manit", "Navya", "Omkar", "Pari", "Qamar", "Rashi",
  "Sagar", "Trisha", "Udit", "Varsha", "Wasim", "Xena", "Yuvraj", "Zoya", "Aayush", "Bhoomi",
  "Chetan", "Devika", "Farhan", "Geetika", "Himanshu", "Anupama", "Balaji", "Chaya", "Dinesh",
  "Eshwari", "Farooq", "Gayatri", "Harpreet", "Indranil", "Jyotika", "Kailashnath", "Lakshmi",
  "Maheshwar", "Nandini", "Parvati", "Kaiser", "Satish", "Ujwal", "Yogeshwar", "Zeenat",
  "Bhagyashree", "Chandrakant", "Deepan", "Elakkiya", "Feroz", "Gowri", "Hrithik", "Ishwari",
  "Jitendra", "Kavya", "Lokeshwar", "Meenakshi", "Nandkishore", "Urvashi", "Prabhakaran",
  "Kamrun", "Rakesh", "Samyukta", "Tushar", "Urmila", "Vijaykumar", "Wahida", "Xavier",
  "Yasmeen", "Zuber", "Aahana", "Brijmohan", "Chandni", "Damyanti", "Eknath", "Falak",
  "Ganeshan", "Hamsa", "Irfan", "Janhvi", "Maninder", "Nandita", "Pratibha", "Qutubuddin",
  "Revathi", "Sampath", "Tanishta", "Uday", "Vaishnavi", "Waseem", "Yashoda", "Zorawar",
  "Aashi", "Babulal", "Charu", "Divyanka", "Eshwar", "Farida", "Gopalakrishnan", "Hema",
  "Imtiaz", "Juhi", "Kirit", "Leelavati", "Madhav", "Naina", "Om", "Preeti", "Rukmini",
  "Tulsi", "Ujjal", "Vibha", "Wahab", "Yami", "Zafar", "Aayushi", "Badal", "Chitra",
  "Deepali", "Ehsaan", "Farah", "Ganesh", "Hina", "Iqbal", "Kailash", "Lata", "Neelam",
  "Poonam", "Radhika", "Sohail", "Tabu", "Vidya", "Yashodhara", "Zain", "Aarti", "Bhanu",
  "Chayanika", "Damini", "Ebrahim", "Fatima", "Heena", "Jaya", "Laxmi", "Mahendra",
  "Pratima", "Rani", "Soham", "Tanuja"
],
  lastNames: [
  "Sharma", "Patel", "Shukla", "Gupta", "Singh", "Deshpande", "Jain", "Verma", "Kapoor",
  "Choudhary", "Malik", "Pathak", "Pandey", "Agarwal", "Chauhan", "Nayak", "Saxena",
  "Mehta", "Bajpayee", "Trivedi", "Khan", "Joshi", "Goswami", "Shah", "Deshmukh",
  "Malhotra", "Yadav", "Rathod", "Mathur", "Tiwari", "Naidu", "Kulkarni", "Rao",
  "Menon", "Shetty", "Reddy", "Iyer", "Chawla", "Ahuja", "Chopra", "Sinha", "Bose",
  "Rangan", "Chandra", "Nair", "Dubey", "Bajaj", "Banerjee", "Sengupta", "Dutta",
  "Khanna", "Bhansali", "Chakraborty", "Sethi", "Wadhwa", "Sood", "Rawat", "Mehra",
  "Burman", "Ganguly", "Ahluwalia", "Dalal", "Grewal", "Luthra", "Sodhi", "Nagpal",
  "Sarin", "Bhatia", "Chadha", "Chhibber", "Duggal", "Kohli", "Kapadia", "Lamba",
  "Saigal", "Berry", "Arora", "Bakshi", "Dhingra", "Gill", "Hassan", "Johal",
  "Katyal", "Raghavan", "Murthy", "Shekhawat", "Pillai", "Hussain", "Chatterjee",
  "Dixit", "Venkatesan", "Hebbar", "Bhatt", "Ahmad", "Sundaram", "Gomes", "Nagarkar",
  "Kini", "Fernandes", "Patil", "Somani", "Dholakia", "Shivdasani", "Sivaram",
  "Kader", "Hegde", "Roshan", "Bhosle", "Jadhav", "Kashyap", "Ayyappan", "Biradar",
  "Raut", "Nambiar", "Shaikh", "Gaekwad", "Nagarkar", "Matondkar", "Naicker",
  "Parveen", "Dsouza", "Begum", "Banerjee", "Pareek", "Sengupta", "Shinde", "Zaidi",
  "Subramaniam", "Pathan", "Bedi", "Das", "Nath", "Devi", "Mukherjee", "Basu",
  "Prasad", "Qureshi", "Rabbani", "Mohammed", "Mangeshkar", "Kothari", "Dhillon",
  "Apte", "Hashmi", "Balan", "Akhtar", "Pratap", "Sen", "Vakil", "Bibi", "Parveen",
  "Singh", "Nath", "Shaikh", "Mukherjee", "Zinta", "Jeelani", "Varma", "Ghosh",
  "Raza", "Gautam", "Imam", "Qureshi", "Rao", "Malik", "Mishra", "Sen", "Bhatia",
  "Prakash", "Joshi", "Gupta", "Shah", "Khan", "Dutta", "Chawla", "Mishra", "Chopra",
  "Basu", "Mukherjee"
]
};
