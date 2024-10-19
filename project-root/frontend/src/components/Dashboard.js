import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [bots, setBots] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('/api/bots')
      .then(res => setBots(res.data))
      .catch(err => console.log(err));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const newBot = {
      name,
      description
    };

    axios.post('/api/bots', newBot)
      .then(res => setBots([...bots, res.data]))
      .catch(err => console.log(err));
  };

  const deleteBot = (id) => {
    axios.delete(`/api/bots/${id}`)
      .then(res => setBots(bots.filter(bot => bot._id !== id)))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Bot Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Add Bot</button>
      </form>
      <ul>
        {bots.map(bot => (
          <li key={bot._id}>
            <h3>{bot.name}</h3>
            <p>{bot.description}</p>
            <button onClick={() => deleteBot(bot._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
