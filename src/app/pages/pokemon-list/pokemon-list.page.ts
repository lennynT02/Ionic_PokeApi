import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  pokemons: any[] = [];
  loading = false;
  isModalOpen = false;
  selectedPokemon: any = null;

  constructor(
    private pokemonService: PokemonService,
  ) { }

  ngOnInit() {
    this.fetchPokemons();
  }

  fetchPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons(50).subscribe({
      next: (response) => {
        // Hacemos un mapeo para agregar la imagen de cada Pokémon
        this.pokemons = response.results.map((pokemon: any) => {
          // Hacemos una petición para obtener la imagen de cada Pokémon
          this.pokemonService.getPokemonDetails(pokemon.name).subscribe({
            next: (details) => {
              pokemon.image = details.sprites.front_default;  // Asumiendo que la imagen está en sprites.front_default
            },
            error: (error) => {
              console.error('Error fetching Pokémon details:', error);
            },
          });
          return pokemon;
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching Pokémon:', error);
        this.loading = false;
      },
    });
  }

  openModal(name: string) {
    this.loading = true;
    this.pokemonService.getPokemonDetails(name).subscribe({
      next: (response) => {
        this.loading = false;
        this.selectedPokemon = response;
        this.isModalOpen = true;
      },
      error: (error) => {
        console.error('Error fetching Pokémon details:', error);
        this.loading = false;
      },
    });
  }
  closeModal() {
    this.isModalOpen = false;
    this.selectedPokemon = null;
  }
}
