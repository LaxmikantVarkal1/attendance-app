![Uploading image.png…]()







# Offline Attendance System

A high-performance, mobile-first application designed for reliable attendance tracking in environments with limited or no internet connectivity. This project prioritizes data integrity, local persistence, and precise statistical reporting.

---

## 🚀 Key Features

* **Offline-First Sync:** Record attendance locally; data automatically synchronizes when a network connection is restored.
* **Precise Analytics:** Built-in logic for calculating attendance percentages and totals, restricted to two decimal places for professional reporting.
* **Modular Architecture:** Uses a clean separation of concerns for global and component-level state management.
* **Native Performance:** Optimized UI components using native view managers for a smooth user experience.
* **Data Export:** Capability to generate and export attendance logs for administrative use.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Expo / React Native |
| **State Management** | Zustand |
| **Styling** | Native Flexbox & Expo UI Properties |

---

## 📊 Core Logic

The application ensures statistical accuracy using standardized formulas. For any given reporting period:

$$Total\ Attendance = \sum (\text{Present Sessions})$$

$$Percentage = \left( \frac{\text{Total Attendance}}{\text{Total Sessions}} \right) \times 100$$

*Note: All numerical outputs are rounded to two decimal places to maintain data consistency.*

---


