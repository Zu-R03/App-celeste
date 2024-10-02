import {IoSearch} from "react-icons/io5";
import {Link} from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll'

export default function Index() {
    return (
        <>
            <nav className="sticky top-0 w-full bg-white shadow-sm z-50">
                <div className="container mx-auto flex items-center">
                    <div className="flex flex-grow">
                        <img className="w-[75px] h-[75px]" src="/Symphony.png"/>
                    </div>
                    <div className="flex flex-grow justify-between items-center">
                        <div className="justify-between">
                            <ScrollLink to="home" spy={true} smooth={true} offset={-70} duration={500} className="font-medium text-xl hover:text-secondary hover:font-semibold lg:mr-10 transition duration-300 ease-in-out">Inicio</ScrollLink>
                            <ScrollLink to="about-us" spy={true} smooth={true} offset={-70} duration={500} className="font-medium text-xl hover:text-secondary hover:font-semibold transition duration-300 ease-in-out">Nosotros</ScrollLink>
                        </div>
                        <div className="flex">
                            <div className="relative flex items-center text-gray-500">
                                <IoSearch className="w-5 h-5 absolute ml-3"/>
                                <input type="text" name="search" placeholder="Buscar..."
                                       className="mr-5 py-2 pl-10 pr-3 font-semibold text-black placeholder-gray-500 rounded-lg border-none ring-2 ring-gray-300"/>
                            </div>
                            <Link to="/sign-up"
                               className="text-white font-semibold bg-secondary border-2 border-secondary py-2 px-3 rounded-lg hover:bg-white hover:border-complementary hover:border-2 hover:text-dark_complementary transition duration-500 ease-in-out">Crear
                                cuenta</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <body>
                <section id="home">
                    <div className="flex items-center justify-around mt-40 mb-32">
                        <div className="text-left w-1/2 items-center">
                            <h1 className="text-6xl font-bold">Descubre una experiencia única al escuchar música</h1>
                            <p className="mt-10 text-3xl">Symphony está a punto de hacer su debut y cambiará la forma en
                                que
                                disfrutas tus canciones.</p>
                        </div>

                        <img
                            src="https://static1.pocketlintimages.com/wordpress/wp-content/uploads/2023/04/apple-music.jpg"
                            className="h-[400px] w-[600px] items-center rounded-3xl"/>

                    </div>
                </section>
                <section id="about-us">
                    <div className="flex items-center h-1/2 justify-around mt-32 mb-32">
                        <img
                            src="https://ijunkie.com/wp-content/uploads/2023/03/Apple-Music-iOS-16.4-1280x960.jpeg"
                            className="h-[470px] w-[600px] items-center rounded-3xl"/>

                        <div className="text-left w-1/2 items-center">
                            <h1 className="text-6xl font-bold text-center">Nosotros</h1>
                            <p className="mt-10 text-2xl text-justify">Symphony surge a raíz de variadas necesidades de
                                nuestra
                                audiencia y las limitaciones en otras plataformas musicales.
                                Nos hemos dedicado a entender las expectativas del público y a abordar las deficiencias
                                en la experiencia musical actual.
                                Estamos emocionados de presentar una solución que redefine la forma en que experimentas
                                la música, diseñada específicamente para satisfacer tus preferencias y elevar tu
                                disfrute auditivo a un nuevo nivel.</p>
                        </div>
                    </div>
                </section>
            </body>
        </>
    )
}