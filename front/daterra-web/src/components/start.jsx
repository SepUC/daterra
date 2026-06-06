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
					<p>Por un mundo más
					 sostenible, más informado</p>
					<ul class="actions special">
						<li><a href="/register" class="button scrolly">Regístrate</a></li>
						<li><a href="/about" class="button scrolly">Aprende más</a></li>
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
							<p>La solución para gestionar desechos y transparencia para los ciudadanos. Daterra es la plataforma ideal para mejorar la interpretación de tus desechos declarados. Para un mejor planeta.</p>
						</div>
						<div class="col-6 col-12-medium imp-medium">
							<span class="image fit"><img src="/single_logo.png" alt="" style={{ maxWidth: '70%', height: 'auto', margin: '0 auto', display: 'block' }} /></span>
						</div>
					</div>
				</div>
			</section>

			<section id="two" class="main style2">
				<div class="container">
					<div class="row gtr-150">
						<div class="col-6 col-12-medium">
							<ul class="major-icons">
								<li><span class="icon solid style2 major fa-bolt"></span></li>
								<li><span class="icon solid style5 major fa-desktop"></span></li>
							</ul>
						</div>
						<div class="col-6 col-12-medium">
							<header class="major">
								<h2>¿Qué es Daterra?</h2>
							</header>
							<p>Daterra es una plataforma innovadora que permite la gestión eficiente de desechos y promueve la transparencia en la comunidad. Nuestra solución ayuda a las municipalidades a mejorar la interpretación de los desechos declarados y a crear un futuro más sostenible.</p>
							<p>Con Daterra, los ciudadanos pueden informarse activamente sobre la gestión de residuos y contribuir al cuidado del medio ambiente, todo en un solo lugar.</p>
						</div>
					</div>
				</div>
			</section>

			<section id="three" class="main style1 special">
				<div class="container">
					<header class="major" style={{ marginBottom: '2em' }}>
						<h1>Nuestros valores</h1>
					</header>
					<div class="row gtr-150">
						<div class="col-4 col-12-medium">
							<span class="image fit"><img src="images/pic02.jpg" alt="" /></span>
							<h3>Transparencia</h3>
							<p>La transparencia es fundamental en nuestra misión de crear un futuro más sostenible. Proporcionamos información clara y accesible sobre la gestión de residuos.</p>
						</div>
						<div class="col-4 col-12-medium">
							<span class="image fit"><img src="images/pic03.jpg" alt="" /></span>
							<h3>Trazabilidad</h3>
							<p>La trazabilidad nos permite seguir los desechos declarados desde su generación hasta su tratamiento final, garantizando responsabilidad y eficiencia.</p>
						</div>
						<div class="col-4 col-12-medium">
							<span class="image fit"><img src="images/pic04.jpg" alt="" /></span>
							<h3>Sostenibilidad</h3>
							<p>La sostenibilidad es un principio central en nuestra visión. Promovemos prácticas de gestión de residuos que minimicen el impacto ambiental y fomenten la conservación de los recursos naturales.</p>
						</div>
					</div>
				</div>
			</section>

			<section id="four" class="main style2 special">
				<div class="container">
					<header class="major">
						<h1>Descarga nuestra aplicación gratuita</h1>
					</header>
					<ul class="actions special">
						<li><a href="#" class="button wide primary">Desde la playstore</a></li>
					</ul>
				</div>
			</section>
    </>
  );
}

export default Start;