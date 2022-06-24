export default function TemplateNavbar() {

    return (

        <div className="bg-black sticky top-0 z-50 flex container min-w-full justify-evenly items-center">
            <ul className="flex text-center">
                <li className="block py-2 w-60 text-white">0 VEP Instances</li>
                <li className="block py-2 w-60 text-white">0 Samplers</li>
                <li className="block py-2 w-60 text-white">0 Tracks</li>
            </ul>
        </div>

    );
};