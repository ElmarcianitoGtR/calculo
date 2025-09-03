import math

def func(x):
    return x**2 - 10  # Example function: x^2 - 10

def deriv_func(x):
    return 2 * x      # Derivative of the example function

def newton_raphson(initial_guess, tolerance=1e-6, max_iterations=100):
    x = initial_guess
    for i in range(max_iterations):
        fx = func(x)
        f_prime_x = deriv_func(x)

        if f_prime_x == 0:
            print("Derivative is zero. Cannot proceed.")
            return None

        next_x = x - fx / f_prime_x

        if abs(next_x - x) < tolerance:
            print(f"Converged in {i+1} iterations.")
            return next_x
        x = next_x
    print("Maximum iterations reached without convergence.")
    return None

# Automate the process
initial_value = 3.0
root = newton_raphson(initial_value)

if root is not None:
    print(f"The root found is: {root}")
