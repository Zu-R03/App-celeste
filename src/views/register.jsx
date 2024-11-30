import React from "react";
import { Link } from "react-router-dom";
import { insertar } from "..";

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-12">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        Crea tu cuenta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Regístrate para empezar
                    </p>
                </div>
                <form className="space-y-6" onSubmit={(event) => insertar(event)}>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nombre(s)
                        </label>
                        <div className="mt-1">
                            <input
                                required
                                id="name"
                                name="name"
                                type="text"
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 bg-gray-50 placeholder:text-gray-500 placeholder:italic"
                                placeholder="Ingresa tu nombre"
                            />
                        </div>
                    </div>

                    {/* Campo de apellido */}
                    <div>
                        <label
                            htmlFor="lastname"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Apellido(s)
                        </label>
                        <div className="mt-1">
                            <input
                                required
                                id="lastname"
                                name="lastname"
                                type="text"
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 bg-gray-50 placeholder:text-gray-500 placeholder:italic"
                                placeholder="Ingresa tu apellido"
                            />
                        </div>
                    </div>

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
                                placeholder="Crea una contraseña segura"
                            />
                        </div>
                    </div>

                    {/* Botón de registro */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 px-4 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                        >
                            Crear cuenta
                        </button>
                    </div>
                </form>

                {/* Separador */}
                <div className="mt-8 flex items-center">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">o</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                {/* Enlace de inicio de sesión */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
