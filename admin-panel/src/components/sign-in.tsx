import { signIn } from "../auth"

export function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-2xl overflow-hidden">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl font-bold justify-center mb-2 text-primary">Welcome Back</h2>
          <p className="text-center text-base-content/70 mb-6">
            Sign in to access your account
          </p>

          <form
            action={async (formData) => {
              "use server"
              await signIn("credentials", {
                  username: formData.get("username"),
                  password: formData.get("password"),
                  redirectTo: "/dashboard", // Redirect to dashboard on success
                })
            }}
            className="space-y-6"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <label className="input input-bordered flex items-center gap-2 transition-all duration-300 hover:border-primary/50">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-base-content/50" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                <input
                  type="text"
                  name="username"
                  placeholder="name@example.com"
                  className="grow bg-transparent focus:outline-none"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2 transition-all duration-300 hover:border-primary/50">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-base-content/50" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m2-4c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-2 2v3m-4-9V6c0-2.2 1.8-4 4-4s4 1.8 4 4v3" 
                  />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="grow bg-transparent focus:outline-none"
                  required
                />
              </label>
            </div>

           

            <button 
              type="submit" 
              className="btn btn-primary w-full rounded-lg hover:btn-primary/90 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          

          
        </div>
      </div>
    </div>
  )
}

export default SignIn