// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [meals, setMeals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '' });
  const [newMetric, setNewMetric] = useState({ type: '', value: '', date: '' });
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', date: '' });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const goalsRes = await axios.get('http://localhost:5000/api/goals');
      const metricsRes = await axios.get('http://localhost:5000/api/health-metrics');
      const mealsRes = await axios.get('http://localhost:5000/api/meals');

      setGoals(goalsRes.data);
      setHealthMetrics(metricsRes.data);
      setMeals(mealsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/signup', { username, password });
      setUser(res.data.userId);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/signin', { username, password });
      setUser(res.data.userId);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Signin failed:', error);
    }
  };

  const handleSignout = async () => {
    try {
      await axios.post('http://localhost:5000/api/signout');
      setUser(null);
      setGoals([]);
      setHealthMetrics([]);
      setMeals([]);
    } catch (error) {
      console.error('Signout failed:', error);
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/goals', newGoal);
      setNewGoal({ title: '', description: '', targetDate: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleMetricSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/health-metrics', newMetric);
      setNewMetric({ type: '', value: '', date: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding health metric:', error);
    }
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/meals', newMeal);
      setNewMeal({ name: '', calories: '', date: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  if (!user) {
    return (
        <div className="App">
          <h1>Fitness Tracker</h1>
          <div className="auth-forms">
            <form onSubmit={handleSignup}>
              <h2>Sign Up</h2>
              <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Sign Up</button>
            </form>
            <form onSubmit={handleSignin}>
              <h2>Sign In</h2>
              <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Sign In</button>
            </form>
          </div>
        </div>
    );
  }

  return (
      <div className="App">
        <h1>Fitness Tracker</h1>
        <button onClick={handleSignout} className="signout-btn">Sign Out</button>

        <section className="goals">
          <h2>Fitness Goals</h2>
          <form onSubmit={handleGoalSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
            />
            <button type="submit">Add Goal</button>
          </form>
          <ul>
            {goals.map((goal) => (
                <li key={goal._id}>
                  {goal.title} - {goal.description} (Target: {new Date(goal.targetDate).toLocaleDateString()})
                </li>
            ))}
          </ul>
        </section>

        <section className="health-metrics">
          <h2>Health Metrics</h2>
          <form onSubmit={handleMetricSubmit}>
            <input
                type="text"
                placeholder="Metric Type"
                value={newMetric.type}
                onChange={(e) => setNewMetric({ ...newMetric, type: e.target.value })}
            />
            <input
                type="number"
                placeholder="Value"
                value={newMetric.value}
                onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
            />
            <input
                type="date"
                value={newMetric.date}
                onChange={(e) => setNewMetric({ ...newMetric, date: e.target.value })}
            />
            <button type="submit">Add Metric</button>
          </form>
          <ul>
            {healthMetrics.map((metric) => (
                <li key={metric._id}>
                  {metric.type}: {metric.value} ({new Date(metric.date).toLocaleDateString()})
                </li>
            ))}
          </ul>
        </section>

        <section className="meals">
          <h2>Meal Planner</h2>
          <form onSubmit={handleMealSubmit}>
            <input
                type="text"
                placeholder="Meal Name"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            />
            <input
                type="number"
                placeholder="Calories"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
            />
            <input
                type="date"
                value={newMeal.date}
                onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
            />
            <button type="submit">Add Meal</button>
          </form>
          <ul>
            {meals.map((meal) => (
                <li key={meal._id}>
                  {meal.name} - {meal.calories} calories ({new Date(meal.date).toLocaleDateString()})
                </li>
            ))}
          </ul>
        </section>
      </div>
  );
}

export default App;