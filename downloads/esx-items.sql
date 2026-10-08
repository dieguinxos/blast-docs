INSERT INTO items (name,label,weight,rare,can_remove) VALUES
('cooler_speaker', 'Cooler Speaker', 18, 0, 1),
('portable_speaker', 'Portable Speaker', 4, 0, 1),
('event_speaker', 'Event Speaker', 25, 0, 1),
('cylinder_speaker', 'Cylinder Speaker', 1, 0, 1),
('backpack_speaker','Backpack Speaker',3,0,1),
('sphere_speaker', 'Sphere Speaker', 2, 0, 1),
('capsule_speaker', 'Sound Capsule', 6, 0, 1),
('display_speaker', 'Display Speaker', 8, 0, 1),
('radiocar', 'Car Radio', 1, 0, 1)
ON DUPLICATE KEY UPDATE label=VALUES(label),weight=VALUES(weight);
