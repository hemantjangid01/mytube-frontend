// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'



// export default function Login () {
//     const navigate=useNavigate();
//     const [username,setusername]=useState("");
//     const [password,setpassword]=useState("");





//     const handleSubmit=async(e)=>{
//         e.preventDefault();
//         setError("");
//     }
//   return (
//     <>
//     <div className='min-h-screen flex justify-center items-center bg-white'>

//     <div className='h-100 w-150  border-2 border-black rounded-xl bg-blue-200 flex flex-col justify-center items-center gap-5 '>


//         <h1 className='text 2xl font-bold'>Login</h1>

//         <div className='flex flex-col gap-4'>
//             <div>
//                 <label className='block '>Enter Username</label>
            
//             <input className='h-10 w-80 border-2 border-black px-2' type="text" placeholder='username'/>
//             </div>
//            <div>
//                 <label className='block '>Enter Password</label>
            
//             <input className='h-10 w-80 border-2 border-black px-2' type="password" placeholder='password'/>
//             </div>
//             <button className='h-9 w-15 border-2 rounded-2xl ml-25 bg-red-500'>submit</button>
//         </div>
        
//         </div>
//         </div>
//     </>
//   )
// }
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const API = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/users/login`,
        {
          email: email.trim(),
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      // Backend has successfully logged in the user
      navigate("/");
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      {/* Login Card */}
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-10">

          {/* Logo / Heading */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="text-gray-500 mt-2">
              Sign in to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold transition hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Signup */}
          <div className="mt-7 text-center text-sm text-gray-500">
            <span>Don't have an account? </span>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-red-600 hover:text-red-700"
            >
              Sign up
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}