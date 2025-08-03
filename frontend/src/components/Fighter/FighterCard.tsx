import React from 'react'
import './FighterCard.css';
const FighterCard = ({props}) => {
  const { first_name, last_name, description, power, speed, durability, iq, image } = props;
  //This will be used some other time but not right now

  return (
    <div>
      <div className="fighter-card bg-amber-800 text-white p-4 rounded-lg shadow-lg">
        <div className = 'name-contaier'>
           <h2 className="fighter-name">Illia Topuria</h2>
        </div>
        <div className = "image-container">
        <img  src="/TOPURIA_ILIA_L_BELT_10-26.avif" alt="Fighter" className="fighter-image" />
        </div>
        <div className="fighter-details">
        <div className= 'stats'>
          <div className="fighter-stats">
  <div className="power-container"><p>Power: 95</p></div>
  <div className="speed-container"><p>Speed: 90</p></div>
  <div className="durability-container"><p>Durability: 85</p></div>
  <div className="iq-container"><p>IQ: 88</p></div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FighterCard

/*The design has to look like something on the right
with the john cena legendary card design*/

/*
So plan is how do I design this fighter Card?

First their has to be a type for the card

Ultra rare is purple, Epic is Orange, Rare is Blue and Common is Green
Legendary is Gold
Because of this all of my Tables now have to change but I will deal with
that another time but as of now no.
One way I can have a combat more
=> This is where you click on fight and this is going to
but you in the arena page where you choose two of your own cards or you have
your own card and you face a random card, you role some kind of wheel
and whatever the wheel lands on is the stat of the card you will face
depending on that stat you either win or lose
if you lose you lose points off your currency if you win you gain points
on your currency. The currency is how to gain more points and
how to buy more cards and how to upgrade your cards



*/