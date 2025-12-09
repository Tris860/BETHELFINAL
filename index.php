<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tris Tech Hub - Flexible Solutions</title>
    <!-- Load Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Use Inter Font -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0d0d0d; /* Deep charcoal/near black */
            color: #ffffff;
            /* Custom Animation for the Pulsating Border Effect */
            --green-accent: #00ff00; /* Tailwind emerald-500 */
        }

        /* Keyframes for a subtle green glow pulse */
        @keyframes pulse-glow {
            0%, 100% {
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.2);
                transform: scale(1.0);
            }
            50% {
                box-shadow: 0 0 15px rgba(24, 185, 16, 0.8), 0 0 30px rgba(16, 185, 129, 0.5);
                transform: scale(1.01);
            }
        }

        .pulsing-card {
            animation: pulse-glow 3s infinite ease-in-out;
            border: 1px solid #00ff00; /* Match the accent color */
            background: rgba(16, 185, 129, 0.05); /* Very light green overlay */
        }

        /* Keyframes for the text fade-in effect */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            animation: fadeIn 1s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.3s; }
        .delay-2 { animation-delay: 0.8s; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">

    <!-- Main Content Card -->
    <div class="pulsing-card max-w-4xl w-full p-8 md:p-16 rounded-2xl shadow-2xl text-center">

        <!-- Logo/Icon Section -->
        <div class="fade-in mb-8 delay-1">
            <!-- Custom SVG Logo for 'Tris Tech Hub' - A stylized T in a circuit board pattern -->
            <svg class="mx-auto w-20 h-20 text-emerald-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Circuit board background effect -->
                <rect x="0" y="0" width="100" height="100" rx="20" fill="url(#pattern0)" opacity="0.1"/>
                <!-- Main 'T' shape -->
                <path d="M50 20 L50 80 M30 20 L70 20" stroke="#10b981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Glow Effect (simulated via CSS box-shadow on the card) -->
                <defs>
                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="0.1" height="0.1">
                        <path d="M0 0H1V1H0V0Z" fill="#10b981"/>
                    </pattern>
                </defs>
            </svg>
            <h1 class="text-4xl md:text-6xl font-extrabold mt-4 text-white">Tris Tech Hub</h1>
        </div>

        <!-- Main Animated Statement -->
        <p class="fade-in mt-6 text-xl md:text-3xl font-light text-emerald-400 delay-2">
            Building flexible solutions
        </p>

        <!-- Subtext/Call to Action -->
        <div class="fade-in mt-10 border-t border-gray-700 pt-6 delay-2">
            <p class="text-gray-400 text-sm md:text-lg">
                Your partner in bespoke software architecture and deployment.
            </p>
            <a href="#" class="inline-block mt-4 px-6 py-3 bg-emerald-500 text-gray-900 font-bold rounded-full transition duration-300 hover:bg-emerald-400 hover:scale-105 shadow-lg">
                Get Started
            </a>
        </div>
    </div>

</body>
</html>