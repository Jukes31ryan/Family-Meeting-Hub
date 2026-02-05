const db = {
    // --- SINGLE MODE: DINNER TABLE ---
    dinner: {
        title: "Lanturn",
        subtitle: "A brighter way to check in.",
        
        // CHECK IN (3 Steps)
        checkin: [
            "🥦 <strong>Veggies:</strong> What is one challenge that tested your patience today?", 
            "🥩 <strong>Meat & Potatoes:</strong> What is the best thing that happened to you today?", 
            "🍰 <strong>Dessert:</strong> What is one thing you are looking forward to tomorrow?"
        ],
        
        // ICE BREAKERS (60+ items)
        iceBreakers: [
            "If you could have a boring superpower (like refilling water cups instantly), what would it be?", 
            "What is the weirdest thing you have ever eaten?", 
            "If animals could talk, which one would be the rudest?", 
            "What is your favorite smell in the whole world?", 
            "If you could build a house out of anything, what would it be?", 
            "What is the bravest thing you have ever done?", 
            "If you were a teacher, what rule would you make for your class?", 
            "What is the best gift you have ever given someone?", 
            "If you could trade places with anyone for a day, who would it be?", 
            "What is your favorite family tradition?", 
            "If you opened a store, what would you sell?", 
            "What is the funniest face you can make?", 
            "If you could instantly learn any instrument, what would you play?", 
            "What is something you are really good at?", 
            "If you could invent a new holiday, what would we celebrate?", 
            "What is your favorite thing to do on a rainy day?", 
            "If you could meet any character from a book, who would it be?", 
            "What is the best dream you’ve ever had?", 
            "If you had a robot helper, what chore would you make it do?", 
            "What is your favorite memory from a vacation?", 
            "If you were a superhero, what would your name be?", 
            "What makes you laugh the most?", 
            "If you could only eat one color of food for a week, which color would you pick?", 
            "What is the kindest thing someone has done for you recently?", 
            "If you could design a new animal, what would it look like?", 
            "What is your favorite thing about yourself?", 
            "If you could time travel to the past or future, where would you go?", 
            "What is the hardest thing about being your age?", 
            "If you could be invisible for one hour, what would you do?", 
            "What is your favorite word?", 
            "If you were the President, what is the first law you would make?", 
            "What is the grossest vegetable?", 
            "If you could have any wild animal as a pet (and it wouldn't bite), what would you pick?", 
            "What is your favorite sound?", 
            "If you could create a new flavor of ice cream, what would it be?", 
            "What is something you want to learn how to do?", 
            "If you could talk to your dog/cat, what would you say?", 
            "What is the most embarrassing thing your parents do?", 
            "If you could be in any movie, which one would you pick?", 
            "What is your favorite thing to do outside?", 
            "If you had 1 million dollars, what is the first thing you would buy?", 
            "What is a fear you used to have but conquered?", 
            "If you could grow a garden of anything (not just plants), what would you grow?", 
            "What is your favorite joke?", 
            "If you could change your name, what would you change it to?", 
            "What is the best compliment you ever received?", 
            "If you could stay up all night, what would you do?", 
            "What is your favorite season and why?", 
            "If you were a ghost, who would you haunt?", 
            "What is the most boring sport to watch?", 
            "If you could fly, where would you go first?", 
            "What is your favorite thing in your bedroom?", 
            "If you could shrink down to the size of an ant, what would you explore?", 
            "What is the best thing about our family?", 
            "If you could have a walk-up song play every time you entered a room, what would it be?", 
            "If you could add a new, magical room to our house, what would it be?", 
            "What movie or TV show character do you think is most like you?", 
            "What's the funniest thing that's ever happened to you?", 
            "If you could only use one emoji for the rest of your life, which one?", 
            "What is the weirdest dream you remember having?", 
            "If you could be an expert in any subject instantly, what would it be?", 
            "What is your favorite snack to sneak?", 
            "What is the grossest bug?"
        ],

        // QUOTES (60+ items)
        quotes: [
            { text: "Family is not an important thing. It's everything.", author: "Michael J. Fox" }, { text: "The love of a family is life's greatest blessing.", author: "Unknown" }, { text: "In time of test, family is best.", author: "Burmese Proverb" }, { text: "The strength of a family, like the strength of an army, is in its loyalty to each other.", author: "Mario Puzo" }, { text: "What can you do to promote world peace? Go home and love your family.", author: "Mother Teresa" }, { text: "A happy family is but an earlier heaven.", author: "George Bernard Shaw" }, { text: "No act of kindness, no matter how small, is ever wasted.", author: "Aesop" }, { text: "Alone we can do so little; together we can do so much.", author: "Helen Keller" }, { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" }, { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" }, { text: "Family means no one gets left behind or forgotten.", author: "David Ogden Stiers" }, { text: "Home is where you are loved the most and act the worst.", author: "Marjorie Pay Hinckley" }, { text: "The memories we make with our family is everything.", author: "Candace Cameron Bure" }, { text: "Family is a life jacket in the stormy sea of life.", author: "J.K. Rowling" }, { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" }, { text: "Happiness is homemade.", author: "Unknown" }, { text: "Ohana means family.", author: "Lilo & Stitch" }, { text: "The most important thing in the world is family and love.", author: "John Wooden" }, { text: "Rejoice with your family in the beautiful land of life.", author: "Albert Einstein" }, { text: "Family is where life begins and love never ends.", author: "Unknown" }, { text: "You don't choose your family. They are God's gift to you.", author: "Desmond Tutu" }, { text: "Other things may change us, but we start and end with the family.", author: "Anthony Brandt" }, { text: "To us, family means putting your arms around each other and being there.", author: "Barbara Bush" }, { text: "A house is built with hands, but a home is built with hearts.", author: "Unknown" }, { text: "Family is the anchor that holds us through life’s storms.", author: "Unknown" }, { text: "The family is one of nature's masterpieces.", author: "George Santayana" }, { text: "Being a family means you are a part of something very wonderful.", author: "Lisa Weed" }, { text: "Peace is the beauty of life. It is sunshine. It is the smile of a child.", author: "Menachem Begin" }, { text: "Children are the hands by which we take hold of heaven.", author: "Henry Ward Beecher" }, { text: "While we try to teach our children all about life, our children teach us what life is all about.", author: "Angela Schwindt" }, { text: "Every day is a fresh start.", author: "Unknown" }, { text: "Kindness is a language which the deaf can hear and the blind can see.", author: "Mark Twain" }, { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" }, { text: "Yesterday is history. Tomorrow is a mystery. Today is a gift.", author: "Eleanor Roosevelt" }, { text: "Try to be a rainbow in someone's cloud.", author: "Maya Angelou" }, { text: "Don't count the days, make the days count.", author: "Muhammad Ali" }, { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" }, { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }, { text: "It always seems impossible until it's done.", author: "Nelson Mandela" }, { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" }, { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" }, { text: "Act as if what you do makes a difference. It does.", author: "William James" }, { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" }, { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" }, { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" }, { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" }, { text: "It is never too late to be what you might have been.", author: "George Eliot" }, { text: "Do the right thing, even when no one is looking.", author: "C.S. Lewis" }, { text: "Honesty is the first chapter in the book of wisdom.", author: "Thomas Jefferson" }, { text: "Politeness is a sign of dignity, not subservience.", author: "Theodore Roosevelt" }, { text: "Gratitude turns what we have into enough.", author: "Unknown" }, { text: "Listening is an act of love.", author: "Unknown" }, { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" }, { text: "Mistakes are proof that you are trying.", author: "Unknown" }, { text: "Integrity is doing the right thing, even when no one is watching.", author: "C.S. Lewis" }, { text: "If you can dream it, you can do it.", author: "Walt Disney" }, { text: "Be silly, be honest, be kind.", author: "Ralph Waldo Emerson" }, { text: "Make each day your masterpiece.", author: "John Wooden" }, { text: "Attitude is a little thing that makes a big difference.", author: "Winston Churchill" }, { text: "The expert in anything was once a beginner.", author: "Helen Hayes" }, { text: "What we think, we become.", author: "Buddha" }, { text: "Tough times never last, but tough people do.", author: "Robert H. Schuller" }, { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" }
        ],

        // MORAL STORIES - Restored to Full Narrative Versions
        dynamics: [ 
            { 
                title: "The Level 99 Paladin", 
                body: "Alex loved video games. He spent every weekend grinding levels to get the 'Golden Armor' for his digital character. He felt powerful in the game. But on Monday morning, he realized he hadn't studied for his math test, his room was a disaster, and he felt exhausted. <br><br>He failed the test. The next day, the game released a new update and his Golden Armor wasn't the best anymore. He realized he had spent all his energy leveling up a fake character while his real character was falling behind. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Real life progress (grades, skills, health) is saved forever. Game progress can be deleted in a second. Prioritize your main character (You).</div>" 
            },
            { 
                title: "The Million Dollar Dust", 
                body: "A young man finally bought his dream car—a vintage red convertible. He loved driving it fast, but he hated the boring stuff like oil changes and tire rotations. 'It runs fine,' he told his dad. 'I'd rather spend that money on gas and road trips.' <br><br>Two years later, the engine seized up on the highway. The mechanic told him the engine was ruined because of the old, sludgy oil. He had to sell the beautiful car for scrap metal. His neighbor, who drove a cheap, ugly sedan but took care of it, was still driving happily. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Taking care of your things is the ultimate money hack. Maintenance is boring, but it is much cheaper than replacement.</div>" 
            },
            { 
                title: "The Green Cloud", 
                body: "Sam played hard at soccer practice. Afterwards, he decided he didn't really need to shower. 'I don't smell that bad,' he told himself, sniffing his shirt. He put on extra deodorant and went to school. <br><br>He didn't notice the smell because he was used to it—he was 'nose blind.' But when he sat next to his crush in science class, she quietly moved three seats away without saying a word. He realized too late that just because *you* can't smell yourself, doesn't mean others can't. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> You are the last person to know if you smell. Trust your parents when they say you need soap. Hygiene is social survival.</div>" 
            },
            { 
                title: "The Silent Assassin", 
                body: "During the championship basketball game, Mia missed an easy layup. It happens. But her teammate, Sarah, rolled her eyes and threw her hands up in the air. Mia saw it. She felt so embarrassed and angry that she played worse the rest of the game. They lost by one point. <br><br>If Sarah had high-fived her and said, 'Get the next one,' Mia might have recovered. Sarah scored the most points that night, but she was the reason they lost. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Your attitude is a teammate. If you are negative, you are playing for the other team.</div>" 
            },
            { 
                title: "The Two Wolves", 
                body: "An old Cherokee chief sat by the fire with his grandson. 'My son,' he said, 'there is a terrible fight going on inside of me. It is a fight between two wolves. One is Evil—he is anger, jealousy, greed, arrogance, and ego. <br><br>The other is Good—he is joy, peace, love, hope, serenity, humility, and kindness.' The boy thought about it for a minute and then asked his grandfather, 'Which wolf wins?' The old chief simply replied, 'The one I feed.' <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Your mind is a battleground. Every thought you dwell on feeds a wolf. Be careful which one you make strong.</div>" 
            },
            { 
                title: "The Magic Word", 
                body: "Ben marched into the living room while his dad was reading. 'Dad, take me to the mall. I need to meet my friends.' His dad didn't even look up. 'No.' Ben stormed off, fuming. <br><br>He realized demanding wasn't working. He cooled down, walked back in, and tried a different angle. 'Hey Dad, if I take out the trash and unload the dishwasher right now, would you mind driving me?' His dad closed the book and grabbed the keys. 'Deal.' <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Negotiation works better than demanding. If you want something, offer value first.</div>" 
            },
            { 
                title: "The Screen Zombie", 
                body: "The family went on a vacation to Hawaii. The beaches were golden, the water was blue. But Tyler spent the entire time on his phone, scrolling through videos of *other* people at the beach. He got mad when his mom asked him to look at the sunset because it interrupted his game. <br><br>Five years later, he looked at photos of the trip. He saw his family smiling, but he had no memory of the waves or the sand. He only remembered the memes he saw on his screen. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Be where your feet are. Don't trade a real memory for a digital one.</div>" 
            },
            { 
                title: "The Broken Lamp", 
                body: "Zack was playing baseball in the house and smashed a lamp. Terrified, he cleaned it up and blamed the cat. His parents found out the truth later. <br><br>They grounded him for a week—not for the lamp, but for the lie. 'If you had just told us,' his mom said, 'we would have just asked you to use your allowance to fix it.' Zack realized the punishment for the lie was ten times worse than the punishment for the accident. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> The truth stings for a minute. A lie rots forever. Dealing with consequences is easier than maintaining a lie.</div>" 
            },
            { 
                title: "The Empty Plate", 
                body: "Sarah sat at the dinner table and groaned. 'Meatloaf again? This is gross.' She pushed her plate away and refused to eat. Her mom didn't argue or cook a second meal. She just put the plate in the fridge. <br><br>At 9:00 PM, Sarah's stomach was growling like a bear, but the kitchen was closed. The next morning, she had to eat the leftovers for breakfast. That cold meatloaf tasted like the best food she had ever eaten. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Hunger makes the best sauce. Gratitude turns what we have into enough.</div>" 
            },
            { 
                title: "The Copycat", 
                body: "Leo didn't want to do his history homework, so he copied his friend's answers on the bus. It was easy. He got an A on the homework. <br><br>But the next week, there was a test. There was no friend to copy from. Leo stared at the paper, sweating, realizing he knew absolutely nothing about the Civil War. He failed the test and had to retake the class in summer school while his friends were at the pool. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Shortcuts are actually longcuts. Doing the work is the only way to own the skill.</div>" 
            },
            { 
                title: "The Angry Text", 
                body: "Jason got into a fight with his best friend. In a moment of rage, he typed out a cruel text message listing all his friend's insecurities. He hit send. He felt better for exactly ten seconds. <br><br>Then he felt sick. He tried to apologize, but his friend had already screenshotted it. The friendship ended that day. Jason learned that you can delete a text, but you can't delete how you made someone feel. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Anger makes you stupid. Never send a message when your heart is beating fast.</div>" 
            },
            { 
                title: "The Heavy Backpack", 
                body: "Every time someone was mean to Chloe, she held onto it. She remembered every insult and every slight. It was like putting a rock in her backpack. <br><br>Soon, her backpack was so heavy with grudges she couldn't enjoy her walk. She saw her friends running ahead, light and happy. She decided to dump the rocks out—to forgive the people who hurt her. She instantly felt light as a feather. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Forgiveness isn't for *them*. It's to lighten *your* load.</div>" 
            },
            { 
                title: "The Snooze Button", 
                body: "Noah wanted to be productive, but when his alarm went off at 7 AM, he hit snooze. Then again. And again. He finally woke up at 7:45, panicked. <br><br>He missed the bus, forgot his lunch, and arrived at school sweating and stressed without his homework. His entire day was ruined because of one decision he made while half-asleep. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> You win the morning, you win the day. When the alarm rings, put your feet on the floor.</div>" 
            },
            { 
                title: "The Rich Man's Trash", 
                body: "A billionaire was asked, 'You have billions of dollars, private jets, and mansions. Is there anything you would trade it all for?' <br><br>The billionaire thought for a moment and said, 'I would trade every single penny just to be 15 years old again, even if I was poor.' You have something money can't buy: Time. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> You are already rich in time. Don't waste your fortune on boredom.</div>" 
            },
            { 
                title: "The Comparison Trap", 
                body: "Emma felt ugly because she didn't look like the influencers on Instagram. She didn't realize that the girl in the photo took 500 shots, used 3 filters, and had professional lighting. <br><br>Emma was comparing her 'behind the scenes' reality to someone else's 'highlight reel.' She put the phone down and looked in the mirror. She was real. The photos were not. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Comparison is the thief of joy. The internet is not real life.</div>" 
            },
            { 
                title: "The Compound Effect", 
                body: "Two planes left Los Angeles for New York. One pilot adjusted his course by just 1 degree south. Nobody noticed. <br><br>After 6 hours of flying, the first plane landed in New York. The second plane, which was just slightly off, landed in Washington D.C. Small habits, done consistently over time, lead to completely different destinations. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> You don't need to be perfect. You just need to be 1% better every day.</div>" 
            },
            { 
                title: "The Echo Canyon", 
                body: "A boy got mad at his brother and shouted 'I hate you!' into a canyon. The canyon shouted back 'I hate you! I hate you!' He got scared. <br><br>His dad told him to shout 'I believe in you!' The canyon shouted back 'I believe in you! I believe in you!' The boy learned that life is an echo. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> The world gives you back exactly what you put out. Radiate positivity.</div>" 
            },
            { 
                title: "The Two Gardeners", 
                body: "One gardener watered his plants only when he felt like it. Some days he forgot, some days he was too tired. The other gardener watered them every single morning, even when it was raining, even when he was tired. <br><br>The first garden withered and died. The second garden grew massive and fed the whole neighborhood. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Motivation is fickle. Discipline is reliable. Do it even when you don't want to.</div>" 
            },
            { 
                title: "The Bored Genius", 
                body: "In 1665, a plague hit London. A young student named Isaac Newton was sent home from college. There was no internet, no TV, and no friends around. He was incredibly bored. <br><br>He sat under a tree, staring at nothing. An apple fell. Because his mind was quiet, he started wondering *why* it fell. In that boredom, he discovered Gravity. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Boredom is not a problem to be fixed; it's an opportunity for your brain to create.</div>" 
            },
            { 
                title: "The Broken Fence", 
                body: "A boy had a bad temper. His father told him to hammer a nail into the wooden fence every time he got angry. The first day, he drove 37 nails. Eventually, he learned to control his temper. <br><br>His father said, 'Now, pull the nails out.' The boy did, but he saw the wood was ruined. 'The fence will never be the same,' his father said. 'When you say things in anger, they leave scars just like these holes.' <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> You can say sorry, but words leave scars. Be careful with your temper.</div>" 
            },
            { 
                title: "The Invisible Backpack", 
                body: "Everyone you meet is wearing an invisible backpack filled with rocks. Some rocks are small (a bad hair day). Some are huge (a sick family member). <br><br>You can't see the rocks, but you can see them struggling to walk. If someone is grumpy or slow, remember the backpack. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Be kind, for everyone you meet is fighting a hard battle you know nothing about.</div>" 
            },
            { 
                title: "The Rusty Bicycle", 
                body: "A boy left his bike in the rain for a month. When he tried to ride it, the chain snapped. He blamed the bike manufacturer. <br><br>His dad showed him a bike kept in the garage that was 10 years older but worked perfectly. 'Things don't break because they are bad,' his dad said. 'They break because they are neglected.' <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> This applies to toys, teeth, and friendships. Neglect destroys everything.</div>" 
            },
            { 
                title: "The Thermostat vs. The Thermometer", 
                body: "A thermometer just reflects the temperature of the room. If it's cold, it reads cold. If it's hot, it reads hot. It is passive. <br><br>A thermostat *sets* the temperature. If it's cold, it turns on the heat. It changes the environment. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Don't just reflect the mood of the room (Thermometer). Be the one who sets the mood (Thermostat).</div>" 
            },
            { 
                title: "The Pottery Class", 
                body: "A pottery teacher split the class. Group A was graded on *quantity* (make 50 pots). Group B was graded on *quality* (make one perfect pot). <br><br>At the end, Group A had the best pots. Why? Because they practiced 50 times while Group B spent all day overthinking one pot and never getting their hands dirty. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Quantity leads to quality. Don't try to be perfect, just do the reps.</div>" 
            },
            { 
                title: "The Crab Bucket", 
                body: "If you put one crab in a bucket, it can crawl out. If you put ten crabs in, none escape. <br><br>Why? Because when one tries to climb out, the others pull it back down. They would rather die together than let one succeed. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Watch out for friends who try to pull you down when you try to improve. Surround yourself with climbers.</div>" 
            },
            { 
                title: "The 10,000 Hour Rule", 
                body: "Mozart wasn't born a genius pianist. He was playing since he was 3. By the time he was 20, he had practiced for thousands of hours. <br><br>We see the result and call it 'talent.' We ignore the years of boring practice that created it. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Hard work beats talent when talent doesn't work hard.</div>" 
            },
            { 
                title: "The Man in the Arena", 
                body: "It is not the critic who counts; not the man who points out how the strong man stumbles. <br><br>The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood; who strives valiantly; who fails again and again. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Ignore the haters in the cheap seats. Only listen to feedback from people who are also in the arena.</div>" 
            },
            { 
                title: "The Marshmallow Test", 
                body: "Researchers put a marshmallow in front of a child. They said, 'You can eat this now. But if you wait 15 minutes, I will give you two.' <br><br>The kids who ate it immediately struggled later in life. The kids who waited ended up being more successful, happier, and healthier. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Patience pays interest. Waiting for what you want often gets you more of it.</div>" 
            },
            { 
                title: "The Starfish Story", 
                body: "A man saw a boy throwing starfish back into the ocean after a storm. 'There are millions,' the man said. 'You can't make a difference.' <br><br>The boy picked up one starfish, threw it in, and said, 'It made a difference to that one.' <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> You can't fix the whole world, but you can fix someone's whole day. Start small.</div>" 
            },
            { 
                title: "The Empty Boat", 
                body: "If a boat hits yours in the fog, you yell at the driver. You are angry! But if you see the boat is empty and just drifting, your anger disappears instantly. <br><br>Most people who hurt you are 'empty boats'—acting out of their own pain, confusion, or carelessness, not trying to target you. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Don't take it personally. They are just drifting.</div>" 
            },
            { 
                title: "The Diamond in the Mud", 
                body: "If you drop a diamond in the mud, is it still a diamond? Yes. Does it look like one? No. <br><br>It needs to be cleaned. But the mud didn't change its value. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Your value doesn't change when you have a bad day or make a mistake. You're just a diamond that needs a wash.</div>" 
            },
            { 
                title: "The Four Minute Mile", 
                body: "For centuries, scientists said running a mile under 4 minutes was impossible. They said the human heart would explode. <br><br>Then Roger Bannister did it. Within a year, dozens of others did it too. The barrier wasn't physical; it was mental. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Impossible is often just a mental barrier. Once you see it can be done, it becomes easy.</div>" 
            },
            { 
                title: "The Farmer and the Horse", 
                body: "A farmer's horse ran away. Neighbors said 'Bad luck!' Farmer said 'Maybe.' The horse returned with wild horses. Neighbors said 'Good luck!' Farmer said 'Maybe.' <br><br>Then his son broke his leg riding a wild horse. 'Bad luck!' 'Maybe.' Then the army came to draft young men, but skipped the son because of his leg. 'Good luck!' <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Don't be too quick to judge a situation as 'good' or 'bad.' Life is a long story.</div>" 
            },
            { 
                title: "The Sword in the Stone", 
                body: "Arthur didn't pull the sword from the stone because he was the strongest or the biggest. The knights tried to use muscle and failed. <br><br>Arthur pulled it because he was *worthy*. He had the right heart. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Character matters more than muscle. Being a good person unlocks doors that strength cannot.</div>" 
            },
            { 
                title: "The Tortoise and the Hare", 
                body: "Everyone knows the rabbit was faster. He had all the talent. But the rabbit stopped to nap, brag, and snack. <br><br>The turtle just kept moving. Step. Step. Step. He won not because he was fast, but because he didn't stop. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Consistency is the ultimate superpower. Slow and steady really does win the race.</div>" 
            },
            { 
                title: "The Sharp Axe", 
                body: "Two woodcutters chopped wood. One chopped all day without stopping. The other stopped every hour for 10 minutes. <br><br>At the end of the day, the second one chopped twice as much wood. Why? Because he spent the 10 minutes sharpening his axe. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Rest is not laziness. Rest is sharpening your axe so you can be more effective.</div>" 
            },
            { 
                title: "The Bamboo Tree", 
                body: "A bamboo seed is watered for 5 years with absolutely no visible growth. It looks dead. <br><br>Then, in the 5th year, it shoots up 90 feet in 6 weeks. It wasn't dead; it was growing massive roots underground to support the height. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Overnight success actually takes years of invisible preparation. Keep watering your dreams.</div>" 
            },
            { 
                title: "The Butterfly Effect", 
                body: "It is said that a butterfly flapping its wings in Brazil can cause a tornado in Texas weeks later. <br><br>Small actions ripple outward. A smile you give a stranger might make them nice to their waiter, who then goes home happy to their kids. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Your small act of kindness today might change someone's entire life tomorrow. Never underestimate your impact.</div>" 
            },
            { 
                title: "The Lesson of the Kite", 
                body: "A kite rises against the wind, not with it. If there was no wind pushing against it, it would fall to the ground. <br><br>Challenges in life are like the wind. They push against us, but that resistance provides the lift we need to soar. <div class='cheat-code-box'>🔑 <strong>Cheat Code:</strong> Resistance and challenges are what help you fly higher. Don't fear the wind.</div>" 
            }
        ],
        
        // SKILLS (60+ items)
        skills: [
            { title: "The Perfect Handshake", body: "Stand up. Make eye contact. Smile. Grip firmly (web to web). Shake twice. Release. It builds instant respect." },
            { title: "The 2-Minute Rule", body: "If a task takes less than 2 minutes (hanging a coat, washing a dish), do it immediately. Never add it to a to-do list." },
            { title: "Active Listening", body: "When someone talks, look at them. Do not think about your response. Just listen. When they finish, ask one question about what they said." },
            { title: "Box Breathing", body: "Anxiety hack: Breathe in for 4 seconds. Hold for 4 seconds. Exhale for 4 seconds. Hold for 4 seconds. Repeat." },
            { title: "How to Apologize", body: "A real apology has 3 parts: 1. 'I am sorry.' 2. 'It was my fault because...' 3. 'Next time I will...' Without part 3, it is just an excuse." },
            { title: "Budgeting 50/30/20", body: "Money rule: 50% for Needs (Rent/Food). 30% for Wants (Fun). 20% for Savings. Always pay your savings first." },
            { title: "Table Manners", body: "Wait until everyone is served before eating. Chew with your mouth closed. Keep elbows off the table while eating. It shows respect for the cook." },
            { title: "The Gratitude Pivot", body: "When you complain ('I have to go to school'), switch 'Have' to 'Get'. 'I GET to go to school.' It changes your brain chemistry." },
            { title: "Changing a Tire", body: "Loosen nuts BEFORE jacking up the car. Jack it up. Remove nuts. Swap tire. Tighten nuts by hand. Lower car. Tighten nuts fully." },
            { title: "How to Introduce People", body: "Say the name of the older/higher status person first. 'Grandma, this is my friend Sam.' It shows social grace." },
            { title: "Making a Bed", body: "Hospital corners: Tuck the foot. Lift the side of the sheet, tuck the excess triangle under, then drop the side. Crisp and tight." },
            { title: "Remembering Names", body: "When introduced, say their name back immediately. 'Nice to meet you, Sarah.' Visualize 'Sarah' written on her forehead." },
            { title: "Writing a Thank You Note", body: "1. Salutation. 2. Mention the specific gift. 3. Say how you will use it. 4. Mention seeing them soon. 5. Sign off." },
            { title: "Doing Laundry", body: "Separate lights and darks. Check pockets! Use cold water to save energy and clothes. Fold immediately to avoid wrinkles." },
            { title: "Unclogging a Sink", body: "Pour boiling water first. Then 1/2 cup baking soda, followed by 1/2 cup vinegar. Cover for 10 mins. Flush with boiling water." },
            { title: "Treating a Burn", body: "Run cool (not freezing) water over it for 10 minutes. Do not pop blisters. Cover loosely with sterile gauze." },
            { title: "Checking Oil", body: "Park on flat ground. Pull dipstick, wipe clean. Re-insert fully. Pull out and check if oil is between min/max lines." },
            { title: "Turning off Water Valve", body: "If a pipe bursts, find the main valve (usually in basement/garage). Turn clockwise until tight. Open faucets to drain." },
            { title: "Sewing a Button", body: "Thread needle, knot the end. Go up through one hole, down the diagonal hole. Repeat 4 times. Do the other pair. Wrap thread around the 'neck' of the button. Tie off." },
            { title: "Using a Fire Extinguisher", body: "PASS: Pull the pin. Aim at the base of fire. Squeeze the handle. Sweep side to side." },
            { title: "Tying a Tie", body: "Four-in-Hand Knot: Wide end over narrow. Around behind. Across front. Up through neck loop. Down through front knot. Tighten." },
            { title: "Reading a Map", body: "Orient the map North. Look for landmarks. Use the scale to estimate distance. Don't rely solely on GPS." },
            { title: "Cooking Pasta", body: "Boil water first. Add lots of salt (should taste like the sea). Don't break the spaghetti. Save some pasta water before draining." },
            { title: "Starting a Fire", body: "Tinder (dry grass), Kindling (small twigs), Fuel (logs). Leave air gaps. Light the tinder. Build up slowly." },
            { title: "Writing a Check", body: "Date. Pay to the Order of (Name). Amount in numbers box. Amount in words on the line. Memo (what for). Sign bottom right." },
            { title: "Ironing a Shirt", body: "Collar first. Then cuffs. Then sleeves. Then the back (yoke). Finally the front panels. Hang immediately." },
            { title: "Plunging a Toilet", body: "Ensure water covers the plunger cup. Create a seal. Push down gently, pull up vigorously. It's the pull that clears the clog." },
            { title: "Using a Compass", body: "Hold flat. Red needle points North. Turn housing to match bearing. Follow the 'direction of travel' arrow." },
            { title: "Identifying Poison Ivy", body: "Leaves of three, let it be. Hairy vine, no friend of mine. White berries, run away." },
            { title: "Folding a Fitted Sheet", body: "Tuck corners inside each other. Lay flat. Fold into a rectangle. It's magic, but it works with practice." },
            { title: "Saving a Document", body: "Ctrl+S (Windows) or Cmd+S (Mac). Do it every 10 minutes. Don't lose your homework." },
            { title: "Escaping a Rip Current", body: "Don't swim against it. Swim parallel to the shore until you are out of the current, then swim back in." },
            { title: "Giving a Toast", body: "Stand up. Keep it short (under 2 mins). Focus on the person, not yourself. End with 'Cheers!' and take a sip." },
            { title: "Scrambling Eggs", body: "Low heat. Butter in pan. Whisk eggs in a bowl first. Pour in. Push gently with spatula. Take off heat *before* they look done." },
            { title: "Using a Drill", body: "Righty-tighty, Lefty-loosey. Keep the drill straight. Apply steady pressure. Don't strip the screw head." },
            { title: "Parallel Parking", body: "Pull up next to the front car. Turn wheel all the way right. Back up until 45 degrees. Straighten wheel. Back in. Turn left to finish." },
            { title: "CPR Basics", body: "Push hard and fast in the center of the chest. 100-120 beats per minute (to the beat of 'Stayin' Alive'). Call 911 first." },
            { title: "Sharpening a Knife", body: "Hold knife at 20-degree angle. Slide across stone/steel like you are slicing a thin layer off it. Repeat both sides." },
            { title: "Finding a Stud", body: "Tap the wall. Hollow sound = no stud. Solid sound = stud. Or look for outlets/switches, studs are usually next to them." },
            { title: "Calculating Tip", body: "Move the decimal one spot left (that's 10%). Double it for 20%. Round up for good service." },
            { title: "Packing a Suitcase", body: "Roll clothes instead of folding to save space and reduce wrinkles. Put heavy shoes at the bottom." },
            { title: "Removing a Stripped Screw", body: "Place a wide rubber band over the screw head. Push screwdriver into the rubber band and turn." },
            { title: "Stop a Nosebleed", body: "Lean forward (not back!). Pinch the soft part of the nose just below the bone. Hold for 10 minutes." },
            { title: "Jump Starting a Car", body: "Red to Dead. Red to Good. Black to Good. Black to Metal (Ground). Start Good car. Start Dead car. Remove in reverse." },
            { title: "Basic Knot: Bowline", body: "The rabbit comes out of the hole, goes around the tree, and goes back into the hole. The 'King of Knots'." },
            { title: "Reading Body Language", body: "Crossed arms = defensive. Leaning in = interested. Looking away = hiding something or bored." },
            { title: "Effective Google Search", body: "Use quotes for exact phrases. Use minus sign (-) to exclude words (e.g. jaguar speed -car)." },
            { title: "Cleaning Windows", body: "Use vinegar and water. Wipe with crumpled newspaper instead of paper towels for a streak-free shine." },
            { title: "Unfreezing a Computer", body: "Ctrl+Alt+Delete (Windows) or Cmd+Option+Esc (Mac). Force quit the bad app." },
            { title: "Measuring without a Ruler", body: "A dollar bill is 6 inches long. Your foot is roughly... a foot. Know your hand span." },
            { title: "Making Coffee", body: "2 tablespoons of grounds for every 6 ounces of water. Use cold, filtered water. Clean the pot." },
            { title: "Setting a Table", body: "Fork on the Left (4 letters). Knife and Spoon on the Right (5 letters). Glass top right." },
            { title: "Shaking Hands", body: "Web-to-web contact. Firm grip but don't crush. 2-3 pumps. Eye contact and a smile are mandatory." },
            { title: "Polishing Shoes", body: "Clean dirt off. Apply polish in circles. Let dry. Buff vigorously with a horsehair brush for shine." },
            { title: "Using Chopsticks", body: "Bottom stick stays still. Top stick moves like a pencil. Hold near the back end, not the tip." },
            { title: "Breaking in Shoes", body: "Wear them with thick socks around the house for short periods. Use a hair dryer on tight spots while wearing them." },
            { title: "Removing Gum from Hair", body: "Don't cut it! Rub peanut butter or olive oil into the gum. It breaks down the stickiness." },
            { title: "Opening a Jar", body: "Run the lid under hot water to expand the metal. Or tap the edge of the lid with a spoon to break the vacuum seal." },
            { title: "Threading a Needle", body: "Cut the thread at an angle. Wet the end. Hold needle against a white background to see the eye." },
            { title: "Identifying Constellations", body: "Find the Big Dipper. The two outer stars of the bowl point directly to the North Star (Polaris)." }
        ],
        ad_text: "Brought to you by",
        ad_link: "Noble Realty WV &rarr;"
    }
};
