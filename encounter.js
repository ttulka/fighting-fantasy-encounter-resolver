const Player = function(skill, stamina) {  
  this.skill = skill;
  this.stamina = stamina;
  
  function* attackGenerator() {
    const dice = () => Math.floor(Math.random() * 6) + 1;
    
    while (stamina > 0) {    
      yield skill + dice();
    }
  }  
  const attackGen = attackGenerator();
  
  const attack = () => attackGen.next().value;
  
  return {
    skill,
    stamina,
    
    attack
  }
}

const Encounter = function(hero, enemy) {  
  this.hero = hero;
  this.enemy = enemy;
  
  const WinnerEnum = {
    HERO: "HERO",
    ENEMY: "ENEMY",
    REMISE: "REMISE"
  }
  
  const fight = (result, won, failed) => {
    let heroAttack = hero.attack();
    let enemyAttack = enemy.attack();
        
    let winner;
    
    if (heroAttack > enemyAttack) {
      enemy.stamina -= heroAttack - enemyAttack;
      winner = WinnerEnum.HERO;
      
    } else if (heroAttack < enemyAttack) {
      hero.stamina -= enemyAttack - heroAttack;
      winner = WinnerEnum.ENEMY;
       
    } else {
      winner = WinnerEnum.REMISE;
    } 
  
    let res = {
      winner,
      hero: {
        attack: heroAttack,
        stamina: hero.stamina 
      },
      enemy: {
        attack: enemyAttack,
        stamina: enemy.stamina 
      }
    };
    
    if (enemy.stamina <= 0) {
      won(res);
      
    } else if (hero.stamina <= 0) {
      failed(res);
      
    } else {
      result(res);
      setTimeout(() => fight(result, won, failed), 1000);
    }
  }
  
  return {
    startFight: fight
  }
}

function init() {

  var running = false;

  const fight = () => {
    if (running) {
      alert('The fight has already begun - be patient!');
      return; 
    }
    running = true;
    
    const hero = new Player(
      parseInt($("input[name='hero.skill']").val()), 
      parseInt($("input[name='hero.stamina']").val())
    );
    
    const enemy = new Player(
      parseInt($("input[name='enemy.skill']").val()),
      parseInt($("input[name='enemy.stamina']").val())
    );
    
    const encounter = new Encounter(hero, enemy);
  
    const resultDiv = $("#result");
    resultDiv.empty();
    
    const showResult = (result) => {
      resultDiv.append(`<p class="result ${result.winner.toLowerCase()}">Hero: <b>${result.hero.attack}</b>, Enemy: <b>${result.enemy.attack}</b></p>`);    
    }
    const won = (result) => {
      showResult(result);
      resultDiv.append(`<p class="finished success">Your won this fight with stamina <b>${result.hero.stamina}</b></p>`);
      running = false;
    }
    const failed = (result) => {
      showResult(result);
      resultDiv.append(`<p class="finished failed">You failed. Your mission finished here...</p>`);
      running = false;    
    }             
    encounter.startFight(showResult, won, failed);
  }
  
  $("#start").click(fight); 
}

$(function() {
    init();
});