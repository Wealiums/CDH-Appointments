const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return ( 
    <footer className="py-6 bg-gray-800 border-t border-green-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-300">
          &copy; { currentYear } CDH Business Accountants. All rights reserved.
        </p>
      </div>
    </footer>
     );
}
 
export default Footer ;