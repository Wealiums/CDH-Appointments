const Heading = ({title}) => {
    return (       
        <section className="bg-gray-800 mb-5 shadow px-4 py-4 border border-green-600 rounded-lg">
            <h1 className="text-2xl font-bold tracking-tight text-white">
            {title}</h1>
        </section> );
}

export default Heading;
