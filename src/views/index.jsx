import { useState } from "react";
import { IoGameController, IoMenu, IoClose, IoLogIn, IoLogOut, IoPersonAdd } from "react-icons/io5";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Index() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const Game = "/images/Game.jpg";
    const LoL = "/images/LoL.jpg";
    const Gears = "/images/Gears.jpg";
    const Wukong = "/images/Wukong.jpg";

    return (
        <>
            {/* Navbar */}
            <nav className="sticky top-0 w-full bg-gray-900 text-white shadow-lg z-50">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <IoGameController className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">GameZone</span>
                    </div>

                    {/* Menu icon for mobile */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                            {isOpen ? <IoClose className="w-8 h-8" /> : <IoMenu className="w-8 h-8" />}
                        </button>
                    </div>

                    {/* Links for larger screens */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <ScrollLink
                            to="home"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="text-lg font-medium hover:text-yellow-400 transition duration-300"
                        >
                            Inicio
                        </ScrollLink>
                        <ScrollLink
                            to="about-us"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="text-lg font-medium hover:text-yellow-400 transition duration-300"
                        >
                            Nosotros
                        </ScrollLink>
                        <ScrollLink
                            to="featured-games"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="text-lg font-medium hover:text-yellow-400 transition duration-300"
                        >
                            Juegos destacados
                        </ScrollLink>

                        {/* User options */}
                        {user ? (
                            <div className="relative group">
                                <button
                                    className="flex items-center space-x-2 text-lg font-medium hover:text-yellow-400 transition duration-300"
                                >
                                    <IoLogIn className="w-6 h-6" />
                                    <span>Mi cuenta</span>
                                </button>
                                <div className="absolute right-0 mt-2 bg-white text-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 transform scale-95 origin-top">
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        <IoLogOut className="inline w-5 h-5 mr-2" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 text-white bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300"
                                >
                                    <IoLogIn className="w-5 h-5" />
                                    <span>Iniciar sesión</span>
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="flex items-center space-x-2 text-gray-900 bg-white px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-white transition duration-300"
                                >
                                    <IoPersonAdd className="w-5 h-5" />
                                    <span>Crear cuenta</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="lg:hidden bg-gray-800 text-white px-4 py-6 space-y-4">
                        <ScrollLink
                            to="home"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="block text-lg font-medium hover:text-yellow-400 transition duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Inicio
                        </ScrollLink>
                        <ScrollLink
                            to="about-us"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="block text-lg font-medium hover:text-yellow-400 transition duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Nosotros
                        </ScrollLink>
                        <ScrollLink
                            to="featured-games"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="block text-lg font-medium hover:text-yellow-400 transition duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Juegos destacados
                        </ScrollLink>
                        {user ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="block text-lg font-medium hover:text-yellow-400 transition duration-300"
                            >
                                <IoLogOut className="w-6 h-6 inline mr-2" />
                                Cerrar sesión
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <Link
                                    to="/login"
                                    className="block text-center text-white bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="block text-center text-gray-900 bg-white px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-white transition duration-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Crear cuenta
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="bg-white">
                {/* Hero Section */}
                <section id="home" className="h-screen flex flex-col justify-center items-center bg-gray-50 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                        Bienvenido a GameZone
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-700 mb-10">
                        Explora una experiencia única en videojuegos. ¡Juega y diviértete con nuestra comunidad!
                    </p>
                    <div className="flex justify-center items-center">
                        <img
                            src={Game}
                            className="h-64 w-80 sm:h-[300px] sm:w-[400px] lg:h-[400px] lg:w-[600px] rounded-lg shadow-lg"
                            alt="Gaming setup"
                        />
                    </div>
                </section>

                {/* About Us */}
                <section id="about-us" className="px-5 py-16 bg-gray-100 text-gray-900">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold">Sobre Nosotros</h1>
                        <p className="mt-6 text-lg lg:text-xl max-w-4xl mx-auto text-gray-700">
                            En GameZone, vivimos y respiramos videojuegos. Nuestro objetivo es conectar a los jugadores
                            de todo el mundo y proporcionarles las mejores experiencias de juego.
                        </p>
                    </div>
                </section>

                {/* Featured Games */}
                <section id="featured-games" className="px-5 py-16 bg-gray-50">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8">Juegos destacados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-5 rounded-lg shadow-lg text-center">
                            <img
                                src={Gears}
                                alt="Gears of War"
                                className="h-60 w-full object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-2xl font-semibold text-gray-900">Gears of War</h3>
                            <p className="text-gray-700 mt-2">Un emocionante juego de acción y aventuras.</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-lg text-center">
                            <img
                                src={LoL}
                                alt="League of Legends"
                                className="h-60 w-full object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-2xl font-semibold text-gray-900">League of Legends</h3>
                            <p className="text-gray-700 mt-2">El mejor juego de estrategia para desafiar tu mente.</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-lg text-center">
                            <img
                                src={Wukong}
                                alt="Black Myth Wukong"
                                className="h-60 w-full object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-2xl font-semibold text-gray-900">Black Myth: Wukong</h3>
                            <p className="text-gray-700 mt-2">Un juego de acción lleno de mitología y aventura.</p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
