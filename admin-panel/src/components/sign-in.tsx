
import { signIn } from "../auth"

export function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center">Sign in</h2>
          <p className="text-center text-base-content/70">
            Enter your email and password to access your account
          </p>
          
          <form
            action={async (formData) => {
              "use server"
              await signIn("credentials", formData)
            }}
            className="space-y-4 mt-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                
                <input
                  type="text"
                  name="email"
                  placeholder="name@example.com"
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                
                <input
                  type="password"
                  name="password"
                  className="grow"
                  
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>
          </form>

          <div className="divider"></div>

          
        </div>
      </div>
    </div>
  )
}

export default SignIn