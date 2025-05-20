import './Gestion.css';
import { TablaCrud } from '../components/TablaCrud';
import { cuestionarioService, usuarioService, preguntaService, respuestaService } from '../components/utils';

export default function Gestion() {
  return (
    <div className="gestion-container">
      <h1>Gestión del sistema</h1>

      <section className="gestion-section">
        <h2>Cuestionarios</h2>
        <TablaCrud
          service={cuestionarioService}
          columns={['Id', 'Nombre', 'Descripción']}
          formFields={[
            { name: 'Id', label: 'Id' },
            { name: 'Nombre', label: 'Nombre' },
            { name: 'Descripcion', label: 'Descripción' }
          ]}
        />
      </section>

      <section className="gestion-section">
        <h2>Usuarios</h2>
        <TablaCrud
          service={usuarioService}
          columns={['Email']}
          formFields={[
            { name: 'email', label: 'Email' }
          ]}
        />
      </section>
        
      {/* 
      -*-*-*---*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
      Editar preguntas en esta solucion es IMPOSIBLE
      -*-*-*----*-*-*----*-*-*----*-*-*----*-*-*---
      */}
      {/*
      <section className="gestion-section">
        <h2>Preguntas</h2>
        <TablaCrud
          service={preguntaService}
          columns={['Id','id_cuestionario', 'Planteo']}
          formFields={[
            { name: 'id_pregunta', label: 'ID Pregunta' },
            { name: 'id_cuestionario', label: 'ID Cuestionario' },
            { name: 'texto', label: 'Texto de la pregunta' }
          ]}
        />
      </section> */}

      <section className="gestion-section">
        <h2>Respuestas</h2>
        <TablaCrud
          service={respuestaService}
          columns={['Id', 'Id_Usuario', 'Respuesta', 'Es_Correcta']}
          formFields={[
            { name: 'id_pregunta', label: 'ID Pregunta' },
            { name: 'respuesta', label: 'Texto de la respuesta' },
            { name: 'esCorrecta', label: '¿Es correcta?' }
          ]}
        />
      </section>
    </div>
  );
}
