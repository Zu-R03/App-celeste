import React from "react";
import { Link } from "react-router-dom";
import { login } from "..";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-12">
            {/* Contenedor del formulario */}
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10">
                {/* Título */}
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        Inicia sesión
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Accede a tu cuenta para continuar
                    </p>
                </div>

                {/* Formulario */}
                <form className="space-y-6" onSubmit={(event) => login(event)}>
                    {/* Campo de correo electrónico */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Correo electrónico
                        </label>
                        <div className="mt-1">
                            <input
                                required
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 bg-gray-50 placeholder:text-gray-500 placeholder:italic"
                                placeholder="Ingresa tu correo electrónico"
                            />
                        </div>
                    </div>

                    {/* Campo de contraseña */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contraseña
                        </label>
                        <div className="mt-1">
                            <input
                                required
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 bg-gray-50 placeholder:text-gray-500 placeholder:italic"
                                placeholder="Ingresa tu contraseña"
                            />
                        </div>
                    </div>

                    {/* Botón de inicio de sesión */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 px-4 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </form>

                {/* Separador */}
                <div className="mt-8 flex items-center">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">o</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                {/* Enlace de registro */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            to="/sign-up"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
