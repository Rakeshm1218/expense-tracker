const express = require('express');
const mongoose = require('mongoose')
const app = express();
const port = 3000;


mongoose.connect('mongodb://localhost:27017/Expense-Tracker');

const expenseScheme = new mongoose.Schema({
  descriotion:String,
  amount:Number
});

const Expense = mongoose.model('Expense',expenseScheme);


app.use(express.json());
app.use(express.static('public'));

let expenses = [];

app.get('/api/expenses', async(req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post('/api/expenses', async(req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.status(201).json(newExpense);
});

app.put('/api/expenses/:id',async (req,res)=>{
  const { id } = req.params;
  const updatedExpense = await Expense.findByIdAndUpdate(id , req.body,)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
