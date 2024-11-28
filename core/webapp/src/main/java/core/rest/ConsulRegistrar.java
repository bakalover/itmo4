package core.rest;

import com.ecwid.consul.v1.ConsulClient;
import com.ecwid.consul.v1.agent.model.NewService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

@Startup
@Singleton
public class ConsulRegistrar {

    private ConsulClient consulClient;
    private String serviceId;

    private final Integer consulPort = 8500;
    private final Integer corePort = 35443;

    @PostConstruct
    public void registerService() {
        consulClient = new ConsulClient("localhost", consulPort);
        NewService newService = new NewService();
        newService.setId("lol");
        newService.setName("core-service");
        newService.setPort(corePort);
        newService.setAddress("localhost");
        consulClient.agentServiceRegister(newService);
        serviceId = newService.getId();
    }

    @PreDestroy
    public void unregisterService() {
        if (consulClient != null && serviceId != null) {
            consulClient.agentServiceDeregister(serviceId);
        }
    }
}
