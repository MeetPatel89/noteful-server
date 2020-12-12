TRUNCATE noteful_notes RESTART IDENTITY CASCADE;

INSERT INTO
    noteful_notes ( name, modified, folderid, content)
VALUES 
    (
        
        'Nautilus Shell',
        '2020-01-24T06:00:00.000Z',
        2,
        'Nautilus Shell is a mathematical object instantiated in the real world'
    ),
    (
        
        'Riemannian',
        '2020-08-11T06:00:00.000Z',
        2,
        'Solve Riemanns hypothesis and win a million dollars'
    ),
    (
        
        'Darwin',
        '2020-10-11T06:00:00.000Z',
        1,
        'On the Origin of Species is the best book ever written'
    )