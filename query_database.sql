-- Numero di persone con meno di 30 anni che guadagnano più di 50.000 dollari l'anno
SELECT count(*) as NumeroPersone FROM records WHERE age < 30 AND over_50k = 1;

-- Guadagno di capitale medio per ogni categoria lavorativa
SELECT w.name as CategoriaLavorativa, avg(capital_gain) as GuadagnoCapitaleMedio FROM records r JOIN workclasses w ON r.workclass_id = w.id GROUP BY w.name;

-- Record denormalizzati
SELECT rec.*, 
w.name as WorkClass , 
el.name as EducationLevel,
ms.Name as MaritalStatus, 
o.name as Occupation,
rel.Name as Relationship, 
rac.name as Race,
s.Name as Sex, 
c.name as Country    
FROM records rec
JOIN workclasses w ON rec.workclass_id = w.id
JOIN education_levels el ON rec.education_level_id = el.id
JOIN marital_statuses ms ON rec.marital_status_id = ms.id
JOIN occupations o ON rec.occupation_id = o.id
JOIN relationships rel ON rec.relationship_id = rel.id
JOIN races rac ON rec.race_id = rac.id
JOIN sexes s ON rec.sex_id = s.id
JOIN countries c ON rec.country_id = c.id;