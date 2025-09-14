import React, { useState, useContext, useEffect } from "react";
import { Eye, EyeOff, User, Lock, Mail, ArrowRight } from "lucide-react";
import droneBackground from "../assets/Img/droneBackground.jpg";
import logoptpn4 from "../assets/Img/logoptpn4.png";
import { AppContext } from "../Context/AppContext";
import Swal from "sweetalert2";
import { BaseURL } from "../URL/BaseUrl";
import axios from "axios";

export default function Login({ onStatus }) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserLoged } = useContext(AppContext);
  const tokenUser = localStorage.getItem("tokenUser");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //Handle Submit For Token
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BaseURL}/ptpn4-api-microservices/user/login`,
        {
          username,
          password,
        }
      );
      const { token } = await response.data;
      localStorage.setItem("tokenUser", token);
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Login",
        text: "Gagal login dengan sukses",
        confirmButtonText: "Silahkan Coba Lagi",
        showCloseButton: true,
      });
    }
  };

  //Get User id And Detail Loged
  useEffect(() => {
    onStatus(false, false);
    const verifyToken = async () => {
      if (tokenUser) {
        onStatus(false, true);
        try {
          const response = await axios.get(
            `${BaseURL}/ptpn4-api-microservices/user/verify`,
            {
              headers: {
                Authorization: `Bearer ${tokenUser}`,
              },
            }
          );
          const responseUser = await axios.get(
            `${BaseURL}/ptpn4-api-microservices/users/${response.data.user.userId}`,
            {
              headers: {
                Authorization: `Bearer ${tokenUser}`,
              },
            }
          );
          if (responseUser.data && responseUser.data) {
            setUserLoged(responseUser.data[0]);
            onStatus(true, false);
          } else {
            console.log("User ID tidak ditemukan dalam response");
          }
        } catch (error) {
          localStorage.removeItem("tokenUser");
          onStatus(false, false);
        }
      }
    };
    verifyToken();
  }, [tokenUser]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${droneBackground})` }}
    >
      {/* Main login container */}
      <div className="relative w-200">
        {/* Glass morphism card */}
        <div className=" bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-white mb-10 mt-10"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Drone Inventory
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-black-400 focus:outline-none focus:ring-2 focus:ring-black-400 focus:border-transparent transition-all duration-300"
                  placeholder="Email address"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-white rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-white-400 focus:outline-none focus:ring-2 focus:ring-black-400 focus:border-transparent transition-all duration-300"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>

              {/* Remember me & Forgot password */}

              {/* Submit Button */}
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 
             border border-transparent text-sm font-medium rounded-lg 
             text-white 
             bg-gradient-to-r from-gray-800 to-gray-900 
             hover:from-black hover:to-gray-800 
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 
             disabled:opacity-50 disabled:cursor-not-allowed 
             transform hover:scale-105 transition-all duration-300 
             shadow-lg hover:shadow-2xl"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
              <img src={logoptpn4} className="w-80 mx-auto" alt="" />
            </div>
          </form>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500 rounded-full opacity-20 animate-bounce lg:hidden"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-bounce animation-delay-1000 lg:hidden"></div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
