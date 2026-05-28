-- ============================================================
-- init.sql
-- Tables: farmers, disease_library, scans
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. FARMERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farmers (
    farmer_id       UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150)    NOT NULL,
    contact_info    VARCHAR(255)
);

-- ────────────────────────────────────────────────────────────
-- 2. DISEASE LIBRARY
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS disease_library (
    disease_id      INTEGER         PRIMARY KEY,
    disease_name    VARCHAR(255)    NOT NULL,
    description     TEXT,
    symptoms        TEXT,
    solution        TEXT,
    status          VARCHAR(20),
    severity        VARCHAR(20),
    cause           VARCHAR(50),
    wiki_url        TEXT,
    image_path      VARCHAR(255),
    crop_type       VARCHAR(100)
);

-- ────────────────────────────────────────────────────────────
-- 3. SCANS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scans (
    scan_id             UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id           UUID            REFERENCES farmers(farmer_id) ON DELETE SET NULL,
    crop_type           VARCHAR(100),
    image_url           VARCHAR(255),
    detected_disease_id INTEGER         REFERENCES disease_library(disease_id) ON DELETE SET NULL,
    confidence_score    NUMERIC(5, 2),
    scanned_at          TIMESTAMPTZ     DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Farmers – 1 sample farmer
-- ────────────────────────────────────────────────────────────
INSERT INTO farmers (farmer_id, name, contact_info)
VALUES (
    gen_random_uuid(),
    'Harpreet Singh',
    'harpreet.singh@example.com | +91-98765-43210 | Amritsar, Punjab, India'
);

-- ────────────────────────────────────────────────────────────
-- Disease Library – from disease_lib.csv
-- ────────────────────────────────────────────────────────────
INSERT INTO disease_library (disease_id, disease_name, description, symptoms, solution, status, severity, cause, wiki_url, image_path, crop_type) VALUES
(18, 'Healthy Peach Plant', 'The peach plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are green and healthy; fruit develops normally; no spots, cankers, or lesions present.', 'Water deeply but infrequently; apply balanced fertilizer in spring; thin fruit for better size; prune annually for open canopy.', 'healthy', 'none', 'none', NULL, NULL, 'Peach'),

(19, 'Bell Pepper with Bacterial Spot', 'A bacterial disease caused by Xanthomonas campestris pv. vesicatoria affecting bell peppers, causing lesions on leaves and fruit.', 'Small water-soaked leaf spots turning brown with yellow margins; scab-like raised spots on fruit; defoliation under severe infection; reduced fruit quality and marketability.', 'Use disease-free certified seeds; apply copper-based bactericides; avoid working with plants when wet; practice crop rotation; remove infected plant debris.', 'diseased', 'high', 'bacterial', 'https://en.wikipedia.org/wiki/Bacterial_leaf_spot', 'Pepper,_bell___Bacterial_spot.JPG', 'Bell Pepper'),

(22, 'Potato with Late Blight', 'A devastating oomycete disease caused by Phytophthora infestans, historically responsible for the Irish Potato Famine.', 'Water-soaked pale green lesions on leaves turning brown-black; white fuzzy sporulation on lesion undersides in humid conditions; rapid vine collapse; brown rot in tubers.', 'Apply protectant fungicides (chlorothalonil) and systemic fungicides (metalaxyl); destroy infected plant material; avoid overhead irrigation; harvest tubers promptly; use resistant varieties.', 'diseased', 'critical', 'oomycete', 'https://en.wikipedia.org/wiki/Phytophthora_infestans', 'Potato___Late_blight.JPG', 'Potato'),

(29, 'Tomato with Bacterial Spot', 'A bacterial disease caused by Xanthomonas species affecting tomato plants in warm, wet conditions.', 'Small water-soaked leaf spots turning dark brown with yellow halos; raised scab-like spots on fruit; defoliation exposing fruit to sunscald; reduced yield.', 'Use copper bactericides; plant certified disease-free transplants; avoid overhead irrigation; practice 2–3 year crop rotation; remove infected debris.', 'diseased', 'high', 'bacterial', 'https://en.wikipedia.org/wiki/Xanthomonas_campestris', 'Tomato___Bacterial_spot.JPG', 'Tomato'),

(31, 'Tomato with Late Blight', 'A destructive oomycete disease caused by Phytophthora infestans capable of wiping out entire tomato crops rapidly.', 'Greasy gray-green water-soaked lesions on leaves and stems; white sporulation on undersides in humid weather; rapid browning and plant collapse; firm brown rot on fruit.', 'Apply systemic fungicides (metalaxyl) and protectants; destroy infected plants immediately; avoid wetting foliage; monitor weather forecasts for blight-favorable conditions.', 'diseased', 'critical', 'oomycete', 'https://en.wikipedia.org/wiki/Phytophthora_infestans', 'Tomato___Late_blight.JPG', 'Tomato'),

(34, 'Tomato with Spider Mites or Two-spotted Spider Mite', 'An infestation by Tetranychus urticae, a common arachnid pest that thrives in hot, dry conditions and can devastate tomato crops.', 'Fine stippling and bronzing on leaf surfaces; yellowing and browning of leaves; fine webbing on leaf undersides and between stems; premature defoliation; reduced fruit set.', 'Apply miticides (abamectin or bifenazate); release predatory mites (Phytoseiulus persimilis); increase humidity around plants; avoid broad-spectrum insecticides that kill beneficial insects.', 'diseased', 'high', 'pest', 'https://en.wikipedia.org/wiki/Tetranychus_urticae', 'Tomato___Spider_mites Two-spotted_spider_mite.JPG', 'Tomato'),

(4, 'Healthy Apple', 'The apple plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are green and firm; fruit develops normally; no lesions, spots, or cankers present.', 'Maintain regular watering and fertilization; perform routine pruning; monitor periodically for early signs of disease or pests.', 'healthy', 'none', 'none', NULL, NULL, 'Apple'),

(5, 'Healthy Blueberry Plant', 'The blueberry plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are green and firm; berries develop normally; no discoloration or lesions present.', 'Maintain acidic soil pH (4.5–5.5); water consistently; apply mulch; prune annually to encourage new growth.', 'healthy', 'none', 'none', NULL, NULL, 'Blueberry'),

(7, 'Healthy Cherry Plant', 'The cherry plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are vibrant green; fruit develops normally; no powdery coatings or lesions present.', 'Ensure good air circulation through pruning; water at the base; apply balanced fertilizer annually.', 'healthy', 'none', 'none', NULL, NULL, 'Cherry'),

(11, 'Healthy Corn (Maize) Plant', 'The corn plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are green and upright; cobs develop normally; no lesions or pustules present.', 'Maintain proper spacing for air circulation; use balanced fertilization; rotate crops seasonally; scout regularly for pests.', 'healthy', 'none', 'none', NULL, NULL, 'Corn'),

(15, 'Healthy Grape Plant', 'The grapevine is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are green and fully expanded; clusters develop normally; no spots, mummies, or streaking present.', 'Perform annual dormant pruning; train vines for good air circulation; monitor for pests and diseases regularly; apply balanced nutrition.', 'healthy', 'none', 'none', NULL, NULL, 'Grape'),

(20, 'Healthy Bell Pepper Plant', 'The bell pepper plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are dark green and firm; fruit develops with smooth skin; no spots or lesions present.', 'Water consistently at the base; fertilize with balanced nutrients; stake plants for support; monitor for aphids and other pests.', 'healthy', 'none', 'none', NULL, NULL, 'Bell Pepper'),

(23, 'Healthy Potato Plant', 'The potato plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are green and upright; tubers develop normally; no lesions, rot, or wilting present.', 'Hill soil around plants; water consistently; apply balanced fertilizer; scout regularly for Colorado potato beetle and other pests.', 'healthy', 'none', 'none', NULL, NULL, 'Potato'),

(24, 'Healthy Raspberry Plant', 'The raspberry plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; canes are vigorous; leaves are green; fruit develops normally; no spots or wilting present.', 'Prune old canes after fruiting; train new canes on supports; water at the base; apply mulch to retain moisture.', 'healthy', 'none', 'none', NULL, NULL, 'Raspberry'),

(17, 'Peach with Bacterial Spot', 'A bacterial disease caused by Xanthomonas arboricola pv. persicae affecting peach trees, particularly in warm, wet climates.', 'Small water-soaked spots on leaves that turn purple-brown with yellow halos; shot-hole appearance as lesion centers fall out; sunken dark spots on fruit; twig cankers.', 'Plant resistant peach varieties; apply copper-based bactericides during dormancy and early season; avoid overhead irrigation; prune to improve airflow.', 'diseased', 'high', 'bacterial', 'https://en.wikipedia.org/wiki/Bacterial_spot_of_stone_fruits', 'Peach___Bacterial_spot.JPG', 'Peach'),

(1, 'Apple with Apple Scab', 'A fungal disease caused by Venturia inaequalis that infects apple trees, causing dark scabby lesions on leaves and fruit.', 'Olive-green to dark brown velvety spots on leaves; scabby corky lesions on fruit surface; premature leaf drop; deformed or cracked fruit.', 'Apply fungicides (captan, myclobutanil) starting at green tip stage; rake and destroy fallen leaves; plant resistant apple varieties; prune for canopy airflow.', 'diseased', 'high', 'fungal', 'https://en.wikipedia.org/wiki/Apple_scab', 'Apple___Apple_scab.JPG', 'Apple'),

(3, 'Apple with Cedar Apple Rust', 'A fungal disease caused by Gymnosporangium juniperi-virginianae requiring both apple and juniper/cedar trees to complete its life cycle.', 'Bright orange-yellow spots on upper leaf surface; spore tubes on lower leaf surface; lesions on fruit and twigs; premature defoliation.', 'Remove nearby juniper hosts where feasible; apply fungicides (myclobutanil or mancozeb) from pink bud through petal fall; plant resistant apple varieties.', 'diseased', 'moderate', 'fungal', 'https://en.wikipedia.org/wiki/Cedar_apple_rust', 'Apple___Cedar_apple_rust.JPG', 'Apple'),

(6, 'Cherry with Powdery Mildew', 'A fungal disease caused by Podosphaera clandestina that affects cherry trees, forming white powdery coatings on plant tissues.', 'White powdery fungal growth on young leaves, shoots, and fruit; curling or distortion of new leaves; stunted shoot growth; premature leaf drop.', 'Apply sulfur-based or potassium bicarbonate fungicides; prune to improve air circulation; avoid excessive nitrogen fertilization; remove and destroy infected tissue.', 'diseased', 'moderate', 'fungal', 'https://en.wikipedia.org/wiki/Podosphaera_clandestina', 'Cherry_(including_sour)___Powdery_mildew.JPG', 'Cherry'),

(9, 'Corn (Maize) with Common Rust', 'A fungal disease caused by Puccinia sorghi producing rust-colored pustules on corn leaves, reducing photosynthetic capacity.', 'Small, oval, brick-red to brown pustules on both leaf surfaces; pustules may turn dark brown-black late in season; yellowing around pustules; severe infections cause premature leaf senescence.', 'Plant resistant corn hybrids; apply fungicides (triazoles or strobilurins) when rust is detected early; monitor fields regularly during humid weather.', 'diseased', 'moderate', 'fungal', 'https://en.wikipedia.org/wiki/Common_smut', 'Corn_(maize)___Common_rust_.JPG', 'Corn'),

(2, 'Apple with Black Rot', 'A fungal disease caused by Botryosphaeria obtusa affecting apple trees, leading to fruit rot and cankers on branches.', 'Brown circular lesions on fruit that enlarge and turn black; purple-bordered leaf spots; sunken cankers on branches; mummified fruit remaining on tree.', 'Remove and destroy infected fruit and mummified apples; prune out dead or cankered wood; apply fungicides (captan or myclobutanil) during growing season; maintain good orchard sanitation.', 'diseased', 'high', 'fungal', 'https://en.wikipedia.org/wiki/Black_rot_(grape_disease)', 'Apple___Black_rot.JPG', 'Apple'),

(8, 'Corn (Maize) with Cercospora and Gray Leaf Spot', 'A fungal disease caused by Cercospora zeae-maydis favored by warm, humid conditions, reducing photosynthesis and yield.', 'Rectangular tan-to-gray lesions parallel to leaf veins; lesions may merge covering large leaf areas; lower leaves affected first; severe cases cause premature leaf death.', 'Plant resistant hybrids; rotate crops with non-host plants; apply foliar fungicides (strobilurins or triazoles); till crop debris to reduce inoculum.', 'diseased', 'high', 'fungal', 'https://en.wikipedia.org/wiki/Grey_leaf_spot', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot.JPG', 'Corn'),

(10, 'Corn (Maize) with Northern Leaf Blight', 'A fungal disease caused by Exserohilum turcicum producing large cigar-shaped lesions on corn leaves.', 'Long, elliptical gray-green to tan lesions (2.5–15 cm) on leaves; lesions have wavy margins; dark sporulation visible in lesions under humid conditions; severe cases cause significant leaf blighting.', 'Use resistant hybrids; apply fungicides at early disease onset; practice crop rotation and residue management; avoid overhead irrigation.', 'diseased', 'high', 'fungal', 'https://en.wikipedia.org/wiki/Northern_corn_leaf_blight', 'Corn_(maize)___Northern_Leaf_Blight.JPG', 'Corn'),

(13, 'Grape with Esca (Black Measles)', 'A complex fungal disease involving multiple wood-rotting fungi causing internal wood decay and external symptoms in grapevines.', 'Tiger-stripe pattern on leaves (yellow/red between veins); dark brown wood streaking internally; small dark spots on berries (measles); sudden vine collapse (apoplexy) in severe cases.', 'Prune out infected wood; protect pruning wounds with fungicide paste; avoid large pruning cuts; remove and replace severely infected vines; no fully curative treatment available.', 'diseased', 'critical', 'fungal', 'https://en.wikipedia.org/wiki/Esca_(grape_disease)', 'Grape___Esca_(Black_Measles).JPG', 'Grape'),

(12, 'Grape with Black Rot', 'A fungal disease caused by Guignardia bidwellii that affects all green parts of the grapevine, causing significant fruit loss.', 'Small yellow leaf spots that enlarge and turn brown with dark borders; black pycnidia dots in lesions; infected berries shrivel into hard black mummies; shoot and tendril lesions.', 'Remove and destroy mummified berries and infected shoots; apply fungicides (mancozeb or myclobutanil) from bud break through veraison; ensure good canopy airflow through pruning.', 'diseased', 'high', 'fungal', 'https://en.wikipedia.org/wiki/Black_rot_(grape_disease)', 'Grape___Black_rot.JPG', 'Grape'),

(14, 'Grape with Isariopsis Leaf Spot', 'A fungal disease caused by Isariopsis clavispora (Pseudocercospora vitis) causing leaf spots and early defoliation in grapes.', 'Angular dark brown spots on upper leaf surface; grayish fungal sporulation on lower leaf surface; premature yellowing and defoliation; reduced vine vigor over time.', 'Apply copper-based or mancozeb fungicides; improve vineyard air circulation through pruning and canopy management; remove fallen infected leaves.', 'diseased', 'low', 'fungal', 'https://en.wikipedia.org/wiki/Pseudocercospora_vitis', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot).JPG', 'Grape'),

(16, 'Orange with Citrus Greening', 'A devastating bacterial disease caused by Candidatus Liberibacter asiaticus, spread by the Asian citrus psyllid insect, with no known cure.', 'Asymmetric yellowing (blotchy mottle) of leaves; small, lopsided, bitter fruit; premature fruit drop; twig dieback; stunted growth; fruit remains green at the bottom when ripe.', 'Remove and destroy infected trees promptly; control Asian citrus psyllid with insecticides; use certified disease-free planting material; apply nutritional supplements to slow symptom progression.', 'diseased', 'critical', 'bacterial', 'https://en.wikipedia.org/wiki/Citrus_greening_disease', 'Orange___Haunglongbing_(Citrus_greening).JPG', 'Orange'),

(25, 'Healthy Soybean Plant', 'The soybean plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; trifoliate leaves are green and fully expanded; pods develop normally; no lesions or discoloration present.', 'Rotate with non-legume crops; inoculate seeds with rhizobium; monitor for soybean aphid and stink bugs; apply balanced fertilization.', 'healthy', 'none', 'none', NULL, NULL, 'Soybean'),

(28, 'Healthy Strawberry Plant', 'The strawberry plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are green and firm; runners are vigorous; fruit develops with normal color and size.', 'Mulch around plants to reduce soil splash; water at the base; renovate beds annually; replace plants every 3 years for best production.', 'healthy', 'none', 'none', NULL, NULL, 'Strawberry'),

(37, 'Tomato Mosaic Virus', 'A highly contagious viral disease caused by Tomato Mosaic Virus (ToMV) spread through contact, tools, and infected seeds.', 'Mosaic pattern of light and dark green on leaves; leaf distortion and blistering; stunted growth; fruit may show internal browning; reduced fruit quality and yield.', 'Use certified virus-free seeds; disinfect tools with bleach solution; wash hands before handling plants; remove infected plants; plant resistant varieties; control aphid vectors.', 'diseased', 'high', 'viral', 'https://en.wikipedia.org/wiki/Tomato_mosaic_virus', 'Tomato___Tomato_mosaic_virus.JPG', 'Tomato'),

(38, 'Healthy Tomato Plant', 'The tomato plant is in good health with no signs of disease or pest infestation.', 'No visible symptoms; leaves are deep green and firm; stems are sturdy; fruit develops with normal color, size, and texture.', 'Water deeply and consistently; stake or cage plants; apply balanced fertilizer; prune suckers for indeterminate varieties; monitor regularly for pests and diseases.', 'healthy', 'none', 'none', NULL, NULL, 'Tomato'),

(32, 'Tomato with Leaf Mold', 'A fungal disease caused by Passalora fulva (formerly Cladosporium fulvum) primarily affecting greenhouse tomatoes.', 'Pale green to yellow spots on upper leaf surface; olive-green to gray velvety fungal growth on lower surface; infected leaves curl, wither, and drop; fruit rarely affected.', 'Improve greenhouse ventilation; reduce humidity below 85%; apply fungicides (chlorothalonil or mancozeb); remove infected leaves; use resistant tomato varieties.', 'diseased', 'low', 'fungal', 'https://en.wikipedia.org/wiki/Passalora_fulva', 'Tomato___Leaf_Mold.JPG', 'Tomato'),

(36, 'Tomato Yellow Leaf Curl Virus', 'A viral disease transmitted by the silverleaf whitefly (Bemisia tabaci), causing severe stunting and yield loss in tomatoes.', 'Upward curling and yellowing of leaf margins; small crumpled leaves; stunted plant growth; flower drop leading to poor fruit set; infected plants appear bushy due to shortened internodes.', 'Control whitefly populations with insecticides or reflective mulches; use resistant tomato varieties; remove and destroy infected plants; use insect-proof netting in greenhouses.', 'diseased', 'critical', 'viral', 'https://en.wikipedia.org/wiki/Tomato_yellow_leaf_curl_virus', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus.JPG', 'Tomato');