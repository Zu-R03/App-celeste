import React from "react";
import {Link, useNavigate} from "react-router-dom";
import { login } from "..";
import { useAuth } from "../context/AuthContext";
export default function Login() {

    const navigate = useNavigate();

    /*const handleRedirect = () => {
        navigate('/home');
    };*/

    const { user, logout } = useAuth();

    return (
        <>
            <div className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-primary">
                <div className="bg-white p-10 sm:mx-auto sm:w-full sm:max-w-sm rounded-xl">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className=" text-center text-2xl font-semibold text-gray-900">
                            {user?.name} Inicia sesión
                        </h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={(event) => login(event)}>
                            <div>
                                <label htmlFor="email" className="block font-medium leading-6 text-gray-900">
                                    Correo electrónico
                                </label>
                                <div className="mt-2">
                                    <input
                                        required={true}
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password"
                                           className="block font-medium leading-6 text-gray-900">
                                        Contraseña
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        required={true}
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    //onClick={handleRedirect}
                                    type="submit"
                                    className="flex w-full mt-10 justify-center rounded-md bg-secondary border-2 border-secondary px-3 py-2 text-md font-semibold leading-6 text-white shadow-sm hover:bg-white hover:text-dark_complementary hover:border-2 hover:border-secondary transition duration-500 ease-in-out"
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        </form>

                        <div className="text-center">
                            <p className="mt-10 font-semibold text-md text-gray-500">
                                ¿Aún no tienes una cuenta?
                            </p>
                            <Link to="/sign-up" className="font-semibold leading-6 text-secondary hover:text-complementary">
                                Crea tu cuenta aquí
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}