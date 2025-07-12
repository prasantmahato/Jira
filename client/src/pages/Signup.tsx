import React from 'react';

const Signup = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Signup</h2>
      <form action="/" method="get">
        <input type="email" name="email" id="email" />
        <input type="password" name="pass" id="pass" />
        <input type="submit" value="submit" />
      </form>
    </div>
  );
};

export default Signup;
