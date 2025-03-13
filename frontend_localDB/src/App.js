import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import About from './components/About'; // New React page

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirects to a static HTML page */}
        <Route path="/" element={<StaticPage url="/home.html" />} />
        <Route path="/login" element={<StaticPage url="/login.html" />} />
        <Route path="/dashboard" element={<StaticPage url="/next_index.html" />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}

// Component to load static HTML pages
function StaticPage({ url }) {
  React.useEffect(() => {
    window.location.href = url; // Redirect to static HTML file
  }, [url]);
  
  return null; // No JSX needed
}

export default App;
