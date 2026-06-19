import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
    const { setShowLogin, setToken, fetchUser } = useAppContext();

    const [state, setState] = useState("login"); // 'login' | 'register' | 'forgot' | 'reset'
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
      
        try {
          if (state === "forgot") {
            const { data } = await axios.post("/api/user/forgot-password", { email });
            if (data.success) {
              toast.success(data.message);
              setState("reset");
            } else {
              toast.error(data.message);
            }
          } else if (state === "reset") {
            const { data } = await axios.post("/api/user/reset-password", { email, otp, newPassword: password });
            if (data.success) {
              toast.success(data.message);
              setState("login");
              setPassword("");
              setOtp("");
            } else {
              toast.error(data.message);
            }
          } else {
            const endpoint = state === "login" ? "/api/user/login" : "/api/user/register";
            const payload = state === "login" ? { email, password } : { name, email, password };
        
            const { data } = await axios.post(endpoint, payload);
        
            if (data.success) {
              setToken(data.token);
              localStorage.setItem("token", data.token);
              axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
              await fetchUser();
              toast.success(state === "login" ? "Logged in!" : "Registered!");
              setShowLogin(false);
            } else {
              toast.error(data.message);
            }
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed");
        } finally {
          setLoading(false);
        }
      };

    return (
        <div
            onClick={() => setShowLogin(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <p className="text-2xl font-medium m-auto text-center">
                    <span className="text-blue-600">User</span>{" "}
                    {state === "login" && "Login"}
                    {state === "register" && "Sign Up"}
                    {state === "forgot" && "Forgot Password"}
                    {state === "reset" && "Reset Password"}
                </p>

                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Type your name"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500"
                            type="text"
                            required
                        />
                    </div>
                )}

                {(state !== "reset") && (
                    <div className="w-full">
                        <p>Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Type your email"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500"
                            type="email"
                            required
                            disabled={state === "reset"}
                        />
                    </div>
                )}

                {state === "reset" && (
                    <div className="w-full">
                        <p>One-Time Password (OTP)</p>
                        <input
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                            placeholder="Enter 6-digit OTP"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500"
                            type="text"
                            maxLength={6}
                            required
                        />
                    </div>
                )}

                {(state === "login" || state === "register" || state === "reset") && (
                    <div className="w-full">
                        <p>{state === "reset" ? "New Password" : "Password"}</p>
                        <div className="relative flex items-center mt-1">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder={state === "reset" ? "Type new password" : "Type your password"}
                                className="border border-gray-200 rounded w-full p-2 pr-10 outline-blue-500"
                                type={showPassword ? "text" : "password"}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {state === "login" && (
                    <div className="text-right">
                        <span
                            onClick={() => setState("forgot")}
                            className="text-sm text-blue-600 cursor-pointer hover:underline"
                        >
                            Forgot password?
                        </span>
                    </div>
                )}

                {state === "forgot" || state === "reset" ? (
                    <p className="text-center">
                        Back to{" "}
                        <span
                            onClick={() => setState("login")}
                            className="text-blue-600 cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>
                ) : state === "register" ? (
                    <p className="text-center">
                        Already have an account?{" "}
                        <span
                            onClick={() => setState("login")}
                            className="text-blue-600 cursor-pointer hover:underline"
                        >
                            Login here
                        </span>
                    </p>
                ) : (
                    <p className="text-center">
                        Don't have an account?{" "}
                        <span
                            onClick={() => setState("register")}
                            className="text-blue-600 cursor-pointer hover:underline"
                        >
                            Register here
                        </span>
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-600 hover:bg-blue-700 transition-all text-white w-full py-2 rounded-md font-medium cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {loading
                        ? "Processing..."
                        : state === "register"
                            ? "Create Account"
                            : state === "forgot"
                                ? "Send OTP"
                                : state === "reset"
                                    ? "Reset Password"
                                    : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;