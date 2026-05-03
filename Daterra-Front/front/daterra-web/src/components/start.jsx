import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

function Start() {
  return (
    <>
			<section id="header">
				<div class="inner">
					<span class="icon solid major fa-cloud"></span>
					<h1>Bienvenido a <strong>Daterra</strong></h1>
					<p>Texto de prueba no sé qué poner acá pero pa saber<br />
					Texto de prueba no sé qué poner acá pero pa saber pt2</p>
					<ul class="actions special">
						<li><a href="#one" class="button scrolly">Regístrate</a></li>
						<li><a href="#two" class="button scrolly">Aprende más</a></li>
					</ul>
				</div>
			</section>

			<section id="one" class="main style1">
				<div class="container">
					<div class="row gtr-150">
						<div class="col-6 col-12-medium">
							<header class="major">
								<h2>Para municipalidades y la gente<br />
								texto</h2>
							</header>
							<p>Hollow Knight is a 2017 Metroidvania video game developed and published by Australian independent developer Team Cherry. The player controls a nameless insectoid warrior in exploring Hallownest, a fallen kingdom plagued by a supernatural disease.</p>
						</div>
						<div class="col-6 col-12-medium imp-medium">
							<span class="image fit"><img src="/anime-woo.gif" alt="" /></span>
						</div>
					</div>
				</div>
			</section>

			<section id="two" class="main style2">
				<div class="container">
					<div class="row gtr-150">
						<div class="col-6 col-12-medium">
							<ul class="major-icons">
								<li><span class="icon solid style1 major fa-code"></span></li>
								<li><span class="icon solid style2 major fa-bolt"></span></li>
								<li><span class="icon solid style3 major fa-camera-retro"></span></li>
								<li><span class="icon solid style4 major fa-cog"></span></li>
								<li><span class="icon solid style5 major fa-desktop"></span></li>
								<li><span class="icon solid style6 major fa-calendar"></span></li>
							</ul>
						</div>
						<div class="col-6 col-12-medium">
							<header class="major">
								<h2>Texto placeholder<br />
								texto placeholder</h2>
							</header>
							<p>Hollow Knight is a 2017 Metroidvania video game developed and published by Australian independent developer Team Cherry. The player controls a nameless insectoid warrior in exploring Hallownest, a fallen kingdom plagued by a supernatural disease</p>
							<p>Hollow Knight: Silksong is a 2025 Metroidvania game developed and published by Australian independent developer Team Cherry. The sequel to Hollow Knight (2017), it was released on 4 September 2025 for Linux, macOS, Nintendo Switch, Nintendo Switch 2, PlayStation 4, PlayStation 5, Windows, Xbox One, and Xbox Series X/S.</p>
							<p>Hollow Knight: Silksong is a 2025 Metroidvania game developed and published by Australian independent developer Team Cherry. The sequel to Hollow Knight (2017), it was released on 4 September 2025 for Linux, macOS, Nintendo Switch, Nintendo Switch 2, PlayStation 4, PlayStation 5, Windows, Xbox One, and.</p>
						</div>
					</div>
				</div>
			</section>

			<section id="three" class="main style1 special">
				<div class="container">
					<header class="major">
						<h2>Más información</h2>
					</header>
					<p>Hollow knight silksong</p>
					<div class="row gtr-150">
						<div class="col-4 col-12-medium">
							<span class="image fit"><img src="images/pic02.jpg" alt="" /></span>
							<h3>Hollow Knight Silksong</h3>
							<p>Hollow Knight: Silksong is a 2025 Metroidvania game developed and published by Australian independent developer Team Cherry. The sequel to Hollow Knight</p>
							<ul class="actions special">
								<li><a href="#" class="button">More</a></li>
							</ul>
						</div>
						<div class="col-4 col-12-medium">
							<span class="image fit"><img src="images/pic03.jpg" alt="" /></span>
							<h3>Hollow Knight Silksong</h3>
							<p>Hollow Knight: Silksong is a 2025 Metroidvania game developed and published by Australian independent developer Team Cherry. The sequel to Hollow Knight</p>
							<ul class="actions special">
								<li><a href="#" class="button">More</a></li>
							</ul>
						</div>
						<div class="col-4 col-12-medium">
							<span class="image fit"><img src="images/pic04.jpg" alt="" /></span>
							<h3>Hollow Knight Silksong</h3>
							<p>Hollow Knight: Silksong is a 2025 Metroidvania game developed and published by Australian independent developer Team Cherry. The sequel to Hollow Knight</p>
							<ul class="actions special">
								<li><a href="#" class="button">More</a></li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section id="four" class="main style2 special">
				<div class="container">
					<header class="major">
						<h2>Descarga nuestra aplicación gratuita</h2>
					</header>
					<p>Desde la playstore!</p>
					<ul class="actions special">
						<li><a href="#" class="button wide primary">Playstore</a></li>
					</ul>
				</div>
			</section>
    </>
  );
}

export default Start;