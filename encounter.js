class Player {

  constructor(skill, stamina) {  
    this.skill = skill;
    this.stamina = stamina;
  }
  
  attack() {
    function* attackGenerator(skill, stamina) {
      const dice = () => Math.floor(Math.random() * 6) + 1;
      
      while (stamina > 0) {    
        yield skill + dice();
      }
    }  
    const attackGen = attackGenerator(this.skill, this.stamina);
    
    return attackGen.next().value;
  }
}

class Encounter {
  
  constructor(hero, enemy) {  
    this.hero = hero;
    this.enemy = enemy;
    
    this.WinnerEnum = {
      HERO: "HERO",
      ENEMY: "ENEMY",
      REMISE: "REMISE"
    }
  } 
  
  fight(result, won, failed) {
    let heroAttack = this.hero.attack();
    let enemyAttack = this.enemy.attack();
        
    let winner;
    
    if (heroAttack > enemyAttack) {
      this.enemy.stamina -= heroAttack - enemyAttack;
      winner = this.WinnerEnum.HERO;
      
    } else if (heroAttack < enemyAttack) {
      this.hero.stamina -= enemyAttack - heroAttack;
      winner = this.WinnerEnum.ENEMY;
       
    } else {
      winner = this.WinnerEnum.REMISE;
    } 
  
    let res = {
      winner,
      hero: {
        attack: heroAttack,
        stamina: this.hero.stamina 
      },
      enemy: {
        attack: enemyAttack,
        stamina: this.enemy.stamina 
      }
    };
    
    if (this.enemy.stamina <= 0) {
      won(res);
      
    } else if (this.hero.stamina <= 0) {
      failed(res);
      
    } else {
      result(res);
      setTimeout(() => this.fight(result, won, failed), 1000);
    }
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
    encounter.fight(showResult, won, failed);
  }
  
  $("#start").click(fight); 
}

$(function() {
    init();
});