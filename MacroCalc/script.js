document.addEventListener('DOMContentLoaded', function () {
    const goalsForm = document.getElementById('goalsForm');
    const mealsList = document.getElementById('mealsList');
    const remainingGoalsDiv = document.getElementById('remainingGoals');
    const mealOptionsSelect = document.getElementById('mealOptions');
    const addSelectedMealBtn = document.getElementById('addSelectedMeal');
    const addMealForm = document.getElementById('addMealForm');
    let goalCalories = 0;
    let goalCarbs = 0;
    let goalFats = 0;
    let goalProteins = 0;
    let availableMeals = [];
    let cachedMeals = []; // Array to cache added meals

    goalsForm.addEventListener('submit', function (event) {
        event.preventDefault();

        goalCalories = parseInt(document.getElementById('goalCalories').value);
        goalCarbs = parseInt(document.getElementById('goalCarbs').value);
        goalFats = parseInt(document.getElementById('goalFats').value);
        goalProteins = parseInt(document.getElementById('goalProteins').value);

        updateGoalsDisplay();
        highlightAvailableMeals();
    });

    addMealForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const mealName = document.getElementById('mealName').value;
        const calories = parseInt(document.getElementById('calories').value);
        const carbs = parseInt(document.getElementById('carbs').value);
        const fats = parseInt(document.getElementById('fats').value);
        const proteins = parseInt(document.getElementById('proteins').value);

        const newMeal = { name: mealName, calories: calories, carbs: carbs, fats: fats, proteins: proteins };
        availableMeals.push(newMeal);
        cachedMeals.push(newMeal); // Cache the added meal

        // Update meal options dropdown
        const option = document.createElement('option');
        option.text = mealName;
        mealOptionsSelect.add(option);

        // Clear the form fields
        addMealForm.reset();
    });

    addSelectedMealBtn.addEventListener('click', function () {
        const selectedMealName = mealOptionsSelect.value;
        const selectedMeal = availableMeals.find(meal => meal.name === selectedMealName);
        if (selectedMeal) {
            addMealToList(selectedMeal);
            highlightAvailableMeals();
        }
    });

    function updateGoalsDisplay() {
        const remainingCalories = goalCalories - getTotalConsumed('calories');
        const remainingCarbs = goalCarbs - getTotalConsumed('carbs');
        const remainingFats = goalFats - getTotalConsumed('fats');
        const remainingProteins = goalProteins - getTotalConsumed('proteins');

        remainingGoalsDiv.innerHTML = `
            <p>Remaining Calories: ${remainingCalories}</p>
            <p>Remaining Carbs: ${remainingCarbs}g</p>
            <p>Remaining Fats: ${remainingFats}g</p>
            <p>Remaining Proteins: ${remainingProteins}g</p>
        `;
    }

    function getTotalConsumed(nutrient) {
        const mealItems = document.querySelectorAll('.meal-item');
        let total = 0;
        mealItems.forEach(item => {
            const values = item.innerText.split('|').map(value => parseInt(value.split(':')[1]));
            switch (nutrient) {
                case 'calories':
                    total += values[0];
                    break;
                case 'carbs':
                    total += values[1];
                    break;
                case 'fats':
                    total += values[2];
                    break;
                case 'proteins':
                    total += values[3];
                    break;
            }
        });
        return total;
    }

    function addMealToList(meal) {
        const mealItem = document.createElement('div');
        mealItem.classList.add('meal-item');
        mealItem.innerHTML = `
            <strong>${meal.name}</strong><br>
            Calories: ${meal.calories} | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g | Proteins: ${meal.proteins}g
            <button class="remove-meal">Remove</button>
        `;
        mealsList.appendChild(mealItem);

        updateGoalsDisplay();
        
        const removeMealBtn = mealItem.querySelector('.remove-meal');
        removeMealBtn.addEventListener('click', function () {
            mealsList.removeChild(mealItem);
            updateGoalsDisplay();
            highlightAvailableMeals();
        });
    }

    function highlightAvailableMeals() {
        const remainingCalories = goalCalories - getTotalConsumed('calories');
        const mealOptions = mealOptionsSelect.options;
        mealOptionsSelect.innerHTML = ''; // Clear dropdown list
        for (let i = 0; i < cachedMeals.length; i++) {
            const meal = cachedMeals[i];
            if (meal.calories <= remainingCalories + 100) {
                const option = document.createElement('option');
                option.text = meal.name;
                mealOptionsSelect.add(option);
            }
        }
    }
});