import { Link } from "react-router-dom"

function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Digital Wallet Login
                </h1>

                <form className="flex flex-col gap-4">

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
                        Login
                    </button>

                </form>

                <p className="mt-5 text-center">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default LoginPage