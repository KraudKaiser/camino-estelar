import CaminoEstelar from "@/assets/images/caminoEstelar.jpeg"
import { Link } from "react-router-dom"

export const ProductDisplay = () =>{
    return(
        <main className="min-h-dvh h-full w-full flex flex-col items-center">
            <section className="flex flex- justify-between w-8/12 min-h-[500px] h-auto my-8 rounded-lg p-4 items-center bg-[#000020]">
                <aside className="w-2/4">
                    <img className="w-[350px] h-auto aspect-square object-contain" src={CaminoEstelar} alt="" />
                </aside>
                <div className="w-full text-amber-50 p-4 ">
                    <h1 className="text-4xl font-[600]">Producto de Camino Estelar</h1>
                    <h2 className="text-3xl font-[400]">ARS 250.000 - ARS 500.000</h2>
                    <h3>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium saepe illum officiis, ea cum labore alias dolor, ut at harum deleniti nostrum aliquid pariatur obcaecati qui, aspernatur quis? Iusto, culpa.</h3>
                    <div className="flex flex-col text-amber-50 border-t-[1px] my-4 py-4 border-amber-50 ">
                        <span className="flex justify-around">
                            <h2>Seleciona tu opcion</h2>
                            <select name="" id="">
                                <option value="">Opcion 1</option>
                                <option value="">Opcion 2</option>
                                <option value="">Opcion 3</option>
                                <option value="">Opcion 4</option>
                                <option value="">Opcion 5</option>
                            </select>
                        </span>
                    </div>
                    <div className="flex flex-col text-amber-50 border-t-[1px] my-4 py-4 border-amber-50 ">
                        <span className="flex justify-around">
                            <h2>Elige cuantas secciones</h2>
                            <select name="" id="">
                                <option value="">Opcion 1</option>
                                <option value="">Opcion 2</option>
                                <option value="">Opcion 3</option>
                                <option value="">Opcion 4</option>
                                <option value="">Opcion 5</option>
                            </select>
                        </span>
                    </div>
                    <div className="flex flex-col text-amber-50 border-t-[1px] my-4 py-4 border-amber-50 ">
                        <span className="flex justify-around ">
                            <span className="flex justify-between gap-4 rounded-lg p-4  bg-amber-50 text-[#000020]">
                                <button>-</button>
                                <p>1</p>
                                <button>+</button>
                            </span>
                            <button className="bg-amber-50 rounded-lg text-[#000020] px-2">Añadir al carrito</button>
                        </span>
                    </div>
                    <div className="flex flex-col text-amber-50 border-t-[1px] my-4 py-4 border-amber-50 ">
                       <h2>SKU: <strong>lorem</strong></h2>
                       <h2>Categoria: <Link to={`/categorias/ejemplo`}>ejemplo</Link></h2>
                    </div>
                </div>
            </section>
        </main>
    )
}