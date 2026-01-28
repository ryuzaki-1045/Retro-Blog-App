import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Input, Logo } from "./index";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const signup = async (data) => {
    setError("");
    try {
      const session = await authService.createAccount(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-25">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign in
          </Link>
        </p>
        {error && (
          <div className="my-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(signup)} className="mt-8">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            {...register("name", { required: true })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (value) => {
                  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  return pattern.test(value) || "Invalid email address";
                },
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            className="mt-6"
            {...register("password", { required: true })}
          />
          <Button type="submit" className="mt-6 w-full">
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
