"# WAREHOUSE-APP-PROOFOFCONCEPT" 

TO USE THE DATABASE RUN THE FOLLOWING CODE 

CREATE DATABASE jr_pet_products;
USE jr_pet_products;

CREATE TABLE warehouse_codes_testing (
    binNo varchar(6),
    Xcoordinates INT NOT NULL,
    Ycoordinates INT NOT NULL
);

INSERT INTO warehouse_codes_testing(binNo, Xcoordinates, Ycoordinates) 
VALUES ("A13", 1840, 160), ("A12", 1650, 420), ("C11", 1650, 860), ("D14", 1835, 1500), ("E02", 580, 1820);

SELECT * FROM warehouse_codes_testing;
