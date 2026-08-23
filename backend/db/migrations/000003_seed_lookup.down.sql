DELETE FROM farm_types
WHERE name IN (
    'indoor',
    'outdoor',
    'greenhouse',
    'mixed'
);
