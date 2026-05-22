import { Link } from "react-router-dom"

function RegisterPage() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h1>

                <form className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder="Enter name"
                        className="border p-3 rounded-lg outline-none"
                    />

                    <input
                        type="email"
                        placeholder="Enter email"
                        className="border p-3 rounded-lg outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Enter password"
                        className="border p-3 rounded-lg outline-none"
                    />

                    <button
                        type="submit"
                        className="bg-black text-white p-3 rounded-lg hover:opacity-90"
                    >
                        Register
                    </button>

                </form>

                <p className="mt-5 text-center">
                    Already have an account?{" "}
                    <Link
                        to="/"
                        className="text-blue-600 font-semibold"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default RegisterPage