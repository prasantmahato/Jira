import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="bg-white lg:w-4/12 md:w-6/12 w-10/12 m-auto my-10 shadow-md">
      <div className="py-8 px-8 rounded-xl">
        <h1 className="font-medium text-2xl mt-3 text-center">Login</h1>
        <form className="mt-6">
          <div className="my-5 text-sm">
            <label htmlFor="username" className="block text-black">
              Username
            </label>
            <input
              type="text"
              id="username"
              autoFocus
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
              placeholder="Username"
            />
          </div>

          <div className="my-5 text-sm">
            <label htmlFor="password" className="block text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
              placeholder="Password"
            />
            <div className="flex justify-end mt-2 text-xs text-gray-600">
              <Link to="/forgot-password">Forget Password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className=" block text-center text-white bg-blue-700 p-3 duration-300 rounded-sm hover:bg-blue-800 w-full"
          >
            Login
          </button>
        </form>

        <div className="flex md:justify-between justify-center items-center mt-10">
          <div className="bg-gray-300 md:block hidden w-4/12" style={{ height: '1px' }}></div>
          <p className="md:mx-2 text-sm font-light text-gray-400">or</p>
          <div className="bg-gray-300 md:block hidden w-4/12" style={{ height: '1px' }}></div>
        </div>

        <div className="grid md:grid-cols-1 gap-2 mt-7">
          
  <button className="flex items-center justify-center gap-2 w-full text-white bg-red-500 p-3 duration-300 rounded-sm hover:bg-red-600">
    <svg
      className="w-5 h-5"
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.3c-6.4 34.7-25.9 64-55 83.5v68.8h88.9c52.1-48 80.3-118.6 80.3-197.2z"
        fill="#4285f4"
      />
      <path
        d="M272 544.3c72.9 0 134.1-24.2 178.7-65.6l-88.9-68.8c-24.6 16.5-56.1 26.3-89.8 26.3-69.1 0-127.6-46.7-148.5-109.4H33.2v68.9C77.9 475.1 168.3 544.3 272 544.3z"
        fill="#34a853"
      />
      <path
        d="M123.5 326.8c-10.4-30.6-10.4-63.7 0-94.3V163.6H33.2c-29.3 58.6-29.3 127.1 0 185.7l90.3-22.5z"
        fill="#fbbc04"
      />
      <path
        d="M272 107.2c39.7 0 75.4 13.6 103.6 40.3l77.6-77.6C406.1 24.4 344.9 0 272 0 168.3 0 77.9 69.2 33.2 163.6l90.3 68.9C144.4 153.9 202.9 107.2 272 107.2z"
        fill="#ea4335"
      />
    </svg>
    Continue with Google
  </button>

        </div>

        <p className="mt-12 text-xs text-center font-light text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-black font-medium">
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
